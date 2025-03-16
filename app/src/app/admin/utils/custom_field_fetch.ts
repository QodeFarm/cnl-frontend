import { HttpClient } from '@angular/common/http';

export class CustomFieldHelper {
    private static customFieldMetadata: any = {};

    // Fetch custom fields based on entity name
    static fetchCustomFields(http: HttpClient, entityName: string, callback: Function) {
      http.get('customfields/customfieldscreate/').subscribe(
        (response: any) => {
          console.log('Custom Fields API Response:', response);
  
          if (response?.data) {
            const customFields = response.data.filter((field: any) => field.entity.entity_name === entityName);
  
            // Save metadata for mapping
            this.customFieldMetadata = customFields.reduce((map: any, field: any) => {
              map[field.custom_field_id.toLowerCase()] = {
                custom_field_id: field.custom_field_id,
                field_type_id: field.field_type_id,
                entity_id: field.entity.entity_id,
                is_required: field.is_required,
                validation_rules: field.validation_rules,
                options: [],
              };
              return map;
            }, {});
  
            console.log('Custom Field Metadata:', this.customFieldMetadata);
  
            // Fetch options for each custom field
            this.fetchAllFieldOptions(http, customFields, callback);
          } else {
            console.warn('No custom fields data found in the API response.');
          }
        },
        (error) => {
          console.error('Error fetching custom fields:', error);
        }
      );
    }
  
    // Fetch options for all custom fields
    private static fetchAllFieldOptions(http: HttpClient, customFields: any[], callback: Function) {
      http.get('customfields/customfieldoptions/').subscribe(
        (response: any) => {
          console.log("Custom Field Options API Response:", response);
  
          if (response?.data) {
            const fieldOptionsMap = response.data.reduce((map: any, option: any) => {
              const fieldId = option.custom_field_id.toLowerCase();
              if (!map[fieldId]) {
                map[fieldId] = [];
              }
              if (option.option_value) {
                map[fieldId].push({ label: option.option_value, value: option.option_value });
              }
              return map;
            }, {});
  
            // Update customFieldMetadata with options
            Object.keys(fieldOptionsMap).forEach(fieldId => {
              if (this.customFieldMetadata[fieldId]) {
                this.customFieldMetadata[fieldId].options = fieldOptionsMap[fieldId];
              }
            });
  
            console.log('Updated Custom Field Metadata with Options:', this.customFieldMetadata);
            callback(customFields, this.customFieldMetadata);
          } else {
            console.warn('No options found in the API response.');
            callback(customFields, this.customFieldMetadata); // Proceed without options
          }
        },
        (error) => {
          console.error('Error fetching custom field options:', error);
          callback(customFields, this.customFieldMetadata); // Proceed without options
        }
      );
    }
  
    // Add custom fields dynamically to formConfig
    static addCustomFieldsToFormConfig(customFields: any[], customFieldMetadata: any, formConfig: any) {
      console.log("Custom Fields to Add:", customFields);
  
      const customFieldConfigs = customFields.map((field: any) => {
        const key = field.custom_field_id.toLowerCase();
        const fieldMetadata = customFieldMetadata[key] || {};
  
        return {
          key: key,
          type: fieldMetadata.options.length > 0 ? 'select' : 'input',
          className: 'col-md-4',
          defaultValue: formConfig.model['custom_field_values'][key] || '',
          templateOptions: {
            label: field.field_name,
            placeholder: field.field_name,
            required: fieldMetadata.is_required,
            options: fieldMetadata.options,
          },
        };
      });
  
      console.log('Final Custom Field Config:', customFieldConfigs);
  
      formConfig.fields[1].fieldGroup = [
        ...formConfig.fields[1].fieldGroup,
        {
          className: 'col-12 custom-form-card-block p-0',
          fieldGroupClassName: 'row m-0 pr-0',
          props: { label: 'Custom Fields' },
          fieldGroup: [
            {
              className: 'col-9 p-0',
              key: 'custom_field_values',
              fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
              fieldGroup: customFieldConfigs
            },
          ]
        },
      ];
  
      formConfig.fields = [
        ...formConfig.fields,
        {
          key: 'custom_field_values',
          fieldGroup: customFieldConfigs,
          hide: true
        },
      ];
  
      console.log("Updated Form Config:", formConfig);
    }

    static addCustomFieldsToFormConfig_2(customFields: any[], customFieldMetadata: any, formConfig: any) {
      console.log("Custom Fields to Add:", customFields);
  
      const customFieldConfigs = customFields.map((field: any) => {
        const key = field.custom_field_id.toLowerCase();
        const fieldMetadata = customFieldMetadata[key] || {};
  
        return {
          key: key,
          type: fieldMetadata.options.length > 0 ? 'select' : 'input',
          className: 'col-md-4',
          defaultValue: formConfig.model['custom_field_values'][key] || '',
          templateOptions: {
            label: field.field_name,
            placeholder: field.field_name,
            required: fieldMetadata.is_required,
            options: fieldMetadata.options,
          },
        };
      });
  
      console.log('Final Custom Field Config:', customFieldConfigs);
  
      formConfig.fields[2].fieldGroup = [
        ...formConfig.fields[2].fieldGroup,
        {
          className: 'col-12 custom-form-card-block p-0',
          fieldGroupClassName: 'row m-0 pr-0',
          props: { label: 'Custom Fields' },
          fieldGroup: [
            {
              className: 'col-9 p-0',
              key: 'custom_field_values',
              fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
              fieldGroup: customFieldConfigs
            },
          ]
        },
      ];
  
      formConfig.fields = [
        ...formConfig.fields,
        {
          key: 'custom_field_values',
          fieldGroup: customFieldConfigs,
          hide: true
        },
      ];
  
      console.log("Updated Form Config:", formConfig);
    }

    static constructCustomFieldsPayload(customFieldValues: any, entityId: string, customId: string | null) {
      if (!customFieldValues) {
        console.warn('No custom field values provided.');
        return {
          custom_field: {},
          custom_field_values: []
        };
      }
  
      // Initialize custom field values array
      const customFieldValuesArray = [];
      const missingRequiredFields = [];
  
      // Iterate over all custom field keys and construct values
      Object.keys(customFieldValues).forEach((fieldKey) => {
        const metadata = this.customFieldMetadata[fieldKey.toLowerCase()] || {}; // Fetch metadata for each field
  
        // Check if the field is required and missing
        if (metadata.is_required &&
          (customFieldValues[fieldKey] === '' || customFieldValues[fieldKey] === null || customFieldValues[fieldKey] === undefined)) {
          missingRequiredFields.push(fieldKey);
        }
  
        // Only include fields that have a value (skip ignored fields)
        if (customFieldValues[fieldKey] !== '' && customFieldValues[fieldKey] !== null && customFieldValues[fieldKey] !== undefined) {
          customFieldValuesArray.push({
            field_value: customFieldValues[fieldKey], // User-entered value
            field_value_type: typeof customFieldValues[fieldKey] === "number" ? "number" : "string", // Determine type
            entity_id: entityId, // Use dynamic entity ID
            custom_field_id: fieldKey, // Field name as custom_field_id
            custom_id: customId // Use dynamic custom ID
          });
        }
      });
  
      // If any required fields are missing, show an alert and stop submission
      if (missingRequiredFields.length > 0) {
        console.error("Required fields missing:", missingRequiredFields);
        return null; // Prevent submission
      }
  
      // Construct payload for multiple custom fields
      return {
        custom_field: Object.keys(customFieldValues).map((fieldKey) => ({
          field_name: fieldKey,
          is_required: this.customFieldMetadata[fieldKey.toLowerCase()]?.is_required || false,
          validation_rules: this.customFieldMetadata[fieldKey.toLowerCase()]?.validation_rules || null,
          field_type_id: this.customFieldMetadata[fieldKey.toLowerCase()]?.field_type_id || null,
          entity_id: entityId // Assign dynamic entity_id
        })),
        custom_field_values: customFieldValuesArray // Include only entered values
      };
    }
}
