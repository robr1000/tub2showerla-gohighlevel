
interface GoHighLevelContact {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  website?: string;
  timezone?: string;
  dnd?: boolean;
  source?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

interface GoHighLevelOpportunity {
  title: string;
  status: string;
  monetaryValue?: number;
  assignedTo?: string;
  contactId: string;
  source?: string;
  customFields?: Record<string, any>;
}

export class GoHighLevelService {
  private apiKey: string;
  private locationId: string;
  private baseUrl = 'https://rest.gohighlevel.com/v1';

  constructor() {
    this.apiKey = process.env.GOHIGHLEVEL_API_KEY || '';
    this.locationId = process.env.GOHIGHLEVEL_LOCATION_ID || '';
    
    if (!this.apiKey || !this.locationId) {
      console.warn('GoHighLevel API key or location ID not configured');
    }
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GoHighLevel API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GoHighLevel API request failed:', error);
      throw error;
    }
  }

  async createContact(contactData: GoHighLevelContact): Promise<any> {
    const payload = {
      ...contactData,
      locationId: this.locationId,
    };

    return await this.makeRequest('/contacts/', 'POST', payload);
  }

  async createOpportunity(opportunityData: GoHighLevelOpportunity): Promise<any> {
    const payload = {
      ...opportunityData,
      locationId: this.locationId,
    };

    return await this.makeRequest('/opportunities/', 'POST', payload);
  }

  async createLead(leadData: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
    projectType: string;
    timeframe: string;
    budget: string;
    currentBathroomIssues?: string[];
    desiredFeatures?: string[];
    additionalNotes?: string;
    source?: string;
  }) {
    try {
      // First, create or update the contact
      const contact = await this.createContact({
        firstName: leadData.firstName,
        lastName: leadData.lastName || '',
        email: leadData.email,
        phone: leadData.phone,
        source: leadData.source || 'Website Form',
        tags: ['Website Lead', 'Bath Remodeling'],
        customFields: {
          projectType: leadData.projectType,
          timeframe: leadData.timeframe,
          budget: leadData.budget,
          currentBathroomIssues: leadData.currentBathroomIssues?.join(', ') || '',
          desiredFeatures: leadData.desiredFeatures?.join(', ') || '',
          additionalNotes: leadData.additionalNotes || '',
        }
      });

      // Then create an opportunity
      const opportunity = await this.createOpportunity({
        title: `${leadData.firstName} ${leadData.lastName || ''} - ${leadData.projectType}`,
        status: 'new',
        contactId: contact.contact.id,
        source: leadData.source || 'Website Form',
        customFields: {
          budget: leadData.budget,
          timeframe: leadData.timeframe,
          projectType: leadData.projectType,
        }
      });

      return {
        success: true,
        contactId: contact.contact.id,
        opportunityId: opportunity.opportunity.id,
        message: 'Lead created successfully in GoHighLevel'
      };
    } catch (error) {
      console.error('Failed to create lead in GoHighLevel:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create lead in GoHighLevel'
      };
    }
  }

  // Webhook method for GoHighLevel to send data
  async sendWebhook(leadData: any) {
    const webhookUrl = process.env.GOHIGHLEVEL_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('GoHighLevel webhook URL not configured');
      return { success: false, message: 'Webhook URL not configured' };
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      return { 
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Webhook sent successfully' : 'Webhook failed'
      };
    } catch (error) {
      console.error('Webhook send failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Webhook send failed'
      };
    }
  }

  // Test connection method
  async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    if (!this.apiKey || !this.locationId) {
      return {
        success: false,
        message: 'GoHighLevel API key or location ID not configured'
      };
    }

    try {
      // Test by getting location info
      const result = await this.makeRequest(`/locations/${this.locationId}`);
      return {
        success: true,
        message: 'GoHighLevel connection successful',
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: `GoHighLevel connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const gohighlevelService = new GoHighLevelService();
