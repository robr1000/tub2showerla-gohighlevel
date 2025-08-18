/**
 * Odoo CRM Integration Service
 * Creates leads in Odoo when customers book appointments
 */

export interface OdooLeadData {
  name: string
  email_from: string
  phone: string
  mobile: string
  street: string
  partner_name: string
  description: string
  stage_id?: number
  source_id?: number
}

interface BookingDataForOdoo {
  lead: {
    id: string
    firstName: string
    lastName: string
    email: string
    cellPhone: string
    address: string
    ownOrRent: string
    availableForConsult: boolean
    decisionMakersAvail: boolean
    renovateElsewhere: boolean
    renovateElsewhereDetails?: string | null
    createdAt: Date
  }
  booking: {
    id: string
    scheduledAt: Date
    duration: number
    notes?: string | null
  }
}

class OdooService {
  private credentials = {
    url: process.env.ODOO_URL || '',
    database: process.env.ODOO_DATABASE || '',
    username: process.env.ODOO_USERNAME || '',
    apiKey: process.env.ODOO_API_KEY || ''
  }

  /**
   * Create XML-RPC request body
   */
  private createXmlRpcBody(method: string, params: any[]): string {
    const formatValue = (value: any): string => {
      if (typeof value === 'string') {
        return `<value><string><![CDATA[${value}]]></string></value>`
      } else if (typeof value === 'number') {
        return `<value><int>${value}</int></value>`
      } else if (typeof value === 'boolean') {
        return `<value><boolean>${value ? '1' : '0'}</boolean></value>`
      } else if (Array.isArray(value)) {
        const arrayItems = value.map(item => {
          if (Array.isArray(item)) {
            const subItems = item.map(subItem => formatValue(subItem)).join('')
            return `<value><array><data>${subItems}</data></array></value>`
          }
          return formatValue(item)
        }).join('')
        return `<value><array><data>${arrayItems}</data></array></value>`
      } else if (typeof value === 'object' && value !== null) {
        const structItems = Object.entries(value).map(([key, val]) => {
          return `<member><name>${key}</name>${formatValue(val)}</member>`
        }).join('')
        return `<value><struct>${structItems}</struct></value>`
      }
      return `<value><string><![CDATA[${value}]]></string></value>`
    }

    const paramsXml = params.map(param => `<param>${formatValue(param)}</param>`).join('')

    return `<?xml version="1.0"?>
<methodCall>
<methodName>${method}</methodName>
<params>${paramsXml}
</methodCall>`
  }

  /**
   * Parse XML-RPC response
   */
  private parseXmlRpcResponse(xmlResponse: string): any {
    console.log('📋 Raw XML Response:', xmlResponse.substring(0, 500) + '...');
    
    // Handle fault responses
    if (xmlResponse.includes('<fault>')) {
      // Try to extract fault code and string
      const faultCodeMatch = xmlResponse.match(/<name>faultCode<\/name>.*?<int>(\d+)<\/int>/s);
      const faultStringMatch = xmlResponse.match(/<name>faultString<\/name>.*?<string>(.*?)<\/string>/s);
      
      const faultCode = faultCodeMatch ? faultCodeMatch[1] : 'unknown';
      const faultString = faultStringMatch ? faultStringMatch[1].trim() : 'XML-RPC fault';
      
      console.error('❌ XML-RPC Fault:', { code: faultCode, message: faultString.substring(0, 200) + '...' });
      
      // Check if it's an authentication issue
      if (faultString.includes('Traceback') && faultString.includes('xmlrpc_2')) {
        throw new Error(`Odoo XML-RPC Error: Server-side error in XML-RPC handler - this might be a trial/saas restriction or configuration issue`)
      }
      
      throw new Error(`XML-RPC Fault ${faultCode}: ${faultString.substring(0, 200)}`)
    }
    
    // Extract value from successful response
    const valueMatch = xmlResponse.match(/<value><int>(\d+)<\/int><\/value>/);
    if (valueMatch) {
      return parseInt(valueMatch[1]);
    }
    
    const stringMatch = xmlResponse.match(/<value><string><!\[CDATA\[(.*?)\]\]><\/string><\/value>/);
    if (stringMatch) {
      return stringMatch[1];
    }
    
    const booleanMatch = xmlResponse.match(/<value><boolean>([01])<\/boolean><\/value>/);
    if (booleanMatch) {
      return booleanMatch[1] === '1';
    }
    
    // For arrays, parse multiple values
    const arrayMatch = xmlResponse.match(/<array><data>(.*?)<\/data><\/array>/s);
    if (arrayMatch) {
      const items = [];
      const itemMatches = arrayMatch[1].matchAll(/<value>.*?<\/value>/g);
      for (const match of itemMatches) {
        items.push(this.parseXmlRpcResponse(`<methodResponse><params><param>${match[0]}</param>
</methodResponse>`));
      }
      return items;
    }
    
    return null;
  }

  /**
   * Make XML-RPC call to Odoo
   */
  private async makeXmlRpcCall(endpoint: string, method: string, params: any[]): Promise<any> {
    const xmlBody = this.createXmlRpcBody(method, params);
    const url = `${this.credentials.url}${endpoint}`;
    
    console.log(`📡 Making XML-RPC call to ${url}`);
    console.log(`📋 Method: ${method}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'Odoo XML-RPC Client'
      },
      body: xmlBody
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const xmlResponse = await response.text();
    console.log(`📨 Response received`);
    
    return this.parseXmlRpcResponse(xmlResponse);
  }

  /**
   * Authenticate with Odoo using XML-RPC
   */
  private async authenticate(): Promise<number> {
    try {
      console.log('🔐 Attempting Odoo XML-RPC authentication...');
      console.log('Server URL:', this.credentials.url);
      console.log('Database:', this.credentials.database);
      console.log('Username:', this.credentials.username);
      
      const result = await this.makeXmlRpcCall('/xmlrpc/2/common', 'authenticate', [
        this.credentials.database,
        this.credentials.username,
        this.credentials.apiKey,
        {}
      ]);
      
      if (!result || result === false) {
        throw new Error('Authentication failed: Invalid credentials');
      }
      
      console.log('✅ Authentication successful, User ID:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Odoo authentication error:', error);
      throw error;
    }
  }

  /**
   * Get the "Qualified" stage ID from CRM pipeline
   */
  private async getQualifiedStageId(uid: number): Promise<number | null> {
    try {
      console.log('🎯 Looking for "Qualified" stage using XML-RPC...');
      
      const result = await this.makeXmlRpcCall('/xmlrpc/2/object', 'execute_kw', [
        this.credentials.database,
        uid,
        this.credentials.apiKey,
        'crm.stage',
        'search_read',
        [[['name', '=', 'Qualified']]],
        { fields: ['id', 'name'] }
      ]);
      
      if (result && result.length > 0) {
        const stageId = result[0].id;
        console.log('✅ Found Qualified stage ID:', stageId);
        return stageId;
      } else {
        console.log('⚠️  Qualified stage not found, using fallback ID: 2');
        return 2;
      }
      
    } catch (error) {
      console.error('❌ Error getting qualified stage ID:', error);
      console.log('⚠️  Using fallback Qualified stage ID: 2');
      return 2;
    }
  }

  /**
   * Create lead in Odoo CRM using XML-RPC
   */
  private async createOdooLead(uid: number, leadData: OdooLeadData): Promise<number> {
    try {
      console.log('💾 Creating lead in Odoo using XML-RPC...');
      console.log('Lead data preview:', {
        name: leadData.name,
        email: leadData.email_from,
        phone: leadData.phone,
        stage_id: leadData.stage_id
      });
      
      const result = await this.makeXmlRpcCall('/xmlrpc/2/object', 'execute_kw', [
        this.credentials.database,
        uid,
        this.credentials.apiKey,
        'crm.lead',
        'create',
        [leadData]
      ]);
      
      if (!result) {
        throw new Error('Lead creation failed: No ID returned');
      }
      
      console.log('✅ Lead created successfully in Odoo, ID:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error creating Odoo lead:', error);
      throw error;
    }
  }

  private mapBookingToOdooLead(bookingData: BookingDataForOdoo, stageId?: number): OdooLeadData {
    const { lead, booking } = bookingData;
    
    const appointmentDate = booking.scheduledAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const appointmentTime = booking.scheduledAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles'
    });

    let description = `WEBSITE BOOKING - Bath Remodeling Lead\n\n`;
    description += `SCHEDULED CONSULTATION:\n`;
    description += `Date: ${appointmentDate}\n`;
    description += `Time: ${appointmentTime} (PST)\n`;
    description += `Duration: ${booking.duration} minutes\n\n`;
    
    description += `CUSTOMER DETAILS:\n`;
    description += `Name: ${lead.firstName} ${lead.lastName}\n`;
    description += `Email: ${lead.email}\n`;
    description += `Phone: ${lead.cellPhone}\n`;
    description += `Address: ${lead.address}\n`;
    description += `Homeowner: ${lead.ownOrRent === 'own' ? 'Yes' : 'No'}\n\n`;
    
    description += `QUALIFICATION:\n`;
    description += `Available for consultation: ${lead.availableForConsult ? 'Yes' : 'No'}\n`;
    description += `Decision makers available: ${lead.decisionMakersAvail ? 'Yes' : 'No'}\n`;
    description += `Additional renovations: ${lead.renovateElsewhere ? 'Yes' : 'No'}\n`;
    
    if (lead.renovateElsewhere && lead.renovateElsewhereDetails) {
      description += `Additional details: ${lead.renovateElsewhereDetails}\n`;
    }
    
    if (booking.notes) {
      description += `\nBOOKING NOTES: ${booking.notes}\n`;
    }
    
    description += `\nLEAD SOURCE: Website Booking\n`;
    description += `LEAD ID: ${lead.id}\n`;
    description += `Generated: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`;

    const leadData: OdooLeadData = {
      name: `${lead.firstName} ${lead.lastName} - Bath Remodeling`,
      partner_name: `${lead.firstName} ${lead.lastName}`,
      email_from: lead.email,
      phone: lead.cellPhone,
      mobile: lead.cellPhone,
      street: lead.address,
      description: description
    };

    if (stageId) {
      leadData.stage_id = stageId;
    }

    return leadData;
  }

  /**
   * Test connection to Odoo
   */
  async testConnection(): Promise<{ success: boolean; userId?: number; error?: string }> {
    try {
      if (!this.credentials.url || !this.credentials.database || !this.credentials.username || !this.credentials.apiKey) {
        throw new Error('Missing Odoo credentials');
      }

      console.log('🧪 Testing Odoo connection...');
      console.log('URL:', this.credentials.url);
      console.log('Database:', this.credentials.database);
      console.log('Username:', this.credentials.username);
      
      const userId = await this.authenticate();
      
      console.log('✅ Odoo connection successful');
      return { success: true, userId };
      
    } catch (error) {
      console.error('❌ Odoo connection failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Create lead from booking data
   */
  async createLeadFromBooking(bookingData: BookingDataForOdoo): Promise<{ success: boolean; leadId?: number; error?: string }> {
    try {
      console.log('📝 Creating Odoo lead from booking data...');
      
      if (!this.credentials.url || !this.credentials.database || !this.credentials.username || !this.credentials.apiKey) {
        throw new Error('Missing Odoo credentials');
      }

      const userId = await this.authenticate();
      const qualifiedStageId = await this.getQualifiedStageId(userId);
      const leadData = this.mapBookingToOdooLead(bookingData, qualifiedStageId || undefined);
      
      console.log('📋 Mapped lead data:', {
        name: leadData.name,
        email: leadData.email_from,
        phone: leadData.phone,
        stage_id: leadData.stage_id || 'default'
      });

      const leadId = await this.createOdooLead(userId, leadData);
      
      console.log('✅ Lead created successfully in Odoo');
      console.log('Lead ID:', leadId);
      console.log('Lead Name:', leadData.name);
      
      return {
        success: true,
        leadId: leadId
      };
      
    } catch (error) {
      console.error('❌ Failed to create Odoo lead:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Direct lead creation (for testing)
   */
  async createLead(leadData: OdooLeadData): Promise<number> {
    try {
      console.log('📝 Creating direct lead:', leadData.name);
      
      const userId = await this.authenticate();
      const leadId = await this.createOdooLead(userId, leadData);
      
      return leadId;
    } catch (error) {
      console.error('❌ Failed to create direct lead:', error);
      throw error;
    }
  }
}

export const odooService = new OdooService();
export type { BookingDataForOdoo };
