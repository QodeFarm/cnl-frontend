"use strict";(self.webpackChunkcnl=self.webpackChunkcnl||[]).push([[702],{1597:(x,h,n)=>{n.d(h,{G:()=>O});var C=n(6814),c=n(5879),y=n(3929),t=n(7871),b=n(2787);let O=(()=>{class f{refreshTable(){this.taTableComponent?.refresh()}constructor(m){this.router=m,this.edit=new c.vpe,this.tableConfig={apiUrl:"customers/customers/?summary=true",showCheckbox:!0,pkId:"customer_id",fixedFilters:[{key:"summary",value:"true"}],pageSize:10,globalSearch:{keys:["created_at","name","email","phone","gst","city_id","ledger_account_id"]},defaultSort:{key:"created_at",value:"descend"},cols:[{fieldKey:"name",name:"Name",sort:!0},{fieldKey:"email",name:"Email",sort:!1},{fieldKey:"phone",name:"Phone",sort:!1},{fieldKey:"gst",name:"GST",sort:!0},{fieldKey:"city_id",name:"City Name",sort:!1,displayType:"map",mapFn:(d,u,k)=>u.city.city_name},{fieldKey:"ledger_account_id",name:"Ledger Account",sort:!0,displayType:"map",mapFn:(d,u,k)=>u.ledger_account.name},{fieldKey:"code",name:"Action",type:"action",actions:[{type:"delete",label:"Delete",confirm:!0,confirmMsg:"Sure to delete?",apiUrl:"customers/customers"},{type:"callBackFn",icon:"fa fa-pen",label:"",callBackFn:(d,u)=>{console.log(d),this.edit.emit(d.customer_id)}}]}]}}}return f.\u0275fac=function(m){return new(m||f)(c.Y36(b.F0))},f.\u0275cmp=c.Xpm({type:f,selectors:[["app-customers-list"]],viewQuery:function(m,d){if(1&m&&c.Gf(t.Z,5),2&m){let u;c.iGM(u=c.CRH())&&(d.taTableComponent=u.first)}},outputs:{edit:"edit"},standalone:!0,features:[c.jDz],decls:1,vars:1,consts:[[3,"options"]],template:function(m,d){1&m&&c._UZ(0,"ta-table",0),2&m&&c.Q6J("options",d.tableConfig)},dependencies:[C.ez,y.l,t.Z]}),f})()},4702:(x,h,n)=>{n.r(h),n.d(h,{CustomersComponent:()=>k});var C=n(6814),c=n(3929),y=n(1597),t=n(5879),b=n(9862),O=n(7127);function f(i,p){1&i&&(t.TgZ(0,"span",21),t._uU(1,"Update Customer"),t.qZA())}function g(i,p){1&i&&(t.TgZ(0,"span",21),t._uU(1,"Create Customer"),t.qZA())}function m(i,p){if(1&i&&(t.TgZ(0,"div",22),t._UZ(1,"ta-form",23),t.qZA()),2&i){const e=t.oxw();t.xp6(1),t.Q6J("options",e.formConfig)}}function d(i,p){if(1&i){const e=t.EpF();t.TgZ(0,"div",24)(1,"app-customers-list",25),t.NdJ("edit",function(l){t.CHM(e);const s=t.oxw();return t.KtG(s.editCustomer(l))}),t.qZA()()}}function u(i,p){if(1&i&&(t.TgZ(0,"div",26)(1,"div",27)(2,"span",28),t._uU(3,"\u2714"),t.qZA()(),t.TgZ(4,"span",29),t._uU(5),t.qZA(),t.TgZ(6,"span",30),t._uU(7,"x"),t.qZA()()),2&i){const e=t.oxw();t.xp6(5),t.Oqu(e.toastMessage)}}let k=(()=>{class i{constructor(e,o){this.http=e,this.cdref=o,this.showCustomerList=!1,this.showForm=!1,this.nowDate=()=>{const l=new Date;return`${l.getFullYear()}-${l.getMonth()+1}-${l.getDate()}`},this.customFieldFormConfig={},this.customFieldMetadata={},this.formConfig={},this.showSuccessToast=!1,this.toastMessage=""}ngOnInit(){this.showCustomerList=!1,this.showForm=!0,this.CustomerEditID=null,this.setFormConfig(),console.log("this.formConfig",this.formConfig),this.fetchCustomFields()}ngAfterViewInit(){const e=".customers-component";this.applyDomManipulations(e);const o=document.querySelector(e);o&&(this.observer=new MutationObserver(()=>{this.applyDomManipulations(e)}),this.observer.observe(o,{childList:!0,subtree:!0}))}fetchCustomFields(){this.http.get("customfields/customfieldscreate/").subscribe(e=>{if(console.log("Custom Fields API Response:",e),e?.data){const o=e.data.filter(l=>"customers"===l.entity.entity_name);this.customFieldMetadata=o.reduce((l,s)=>(l[s.custom_field_id.toLowerCase()]={custom_field_id:s.custom_field_id,field_type_id:s.field_type_id,entity_id:s.entity.entity_id,is_required:s.is_required,validation_rules:s.validation_rules,options:[]},l),{}),console.log("Custom Field Metadata:",this.customFieldMetadata),this.fetchAllFieldOptions(o)}else console.warn("No custom fields data found in the API response.")},e=>{console.error("Error fetching custom fields:",e)})}fetchAllFieldOptions(e){this.http.get("customfields/customfieldoptions/").subscribe(o=>{if(console.log("Custom Field Options API Response:",o),o?.data){const l=o.data.reduce((s,a)=>{const r=a.custom_field_id.toLowerCase();return s[r]||(s[r]=[]),a.option_value&&s[r].push({label:a.option_value,value:a.option_value}),s},{});Object.keys(l).forEach(s=>{this.customFieldMetadata[s]&&(this.customFieldMetadata[s].options=l[s])}),console.log("Updated Custom Field Metadata with Options:",this.customFieldMetadata),this.addCustomFieldsToFormConfig(e)}else console.warn("No options found in the API response."),this.addCustomFieldsToFormConfig(e)},o=>{console.error("Error fetching custom field options:",o),this.addCustomFieldsToFormConfig(e)})}addCustomFieldsToFormConfig(e){console.log("Custom Fields to Add:",e);const o=e.map(l=>{const s=l.custom_field_id.toLowerCase(),a=this.customFieldMetadata[s]||{};return{key:s,type:a.options.length>0?"select":"input",className:"col-md-6",defaultValue:this.formConfig.model.custom_field_values[s]||"",templateOptions:{label:l.field_name,placeholder:l.field_name,required:a.is_required,options:a.options}}});console.log("Final Custom Field Config:",o),this.formConfig.fields[1].fieldGroup=[...this.formConfig.fields[1].fieldGroup,{className:"col-12 custom-form-card-block p-0",fieldGroupClassName:"row m-0 pr-0",props:{label:"Custom Fields"},fieldGroup:[{className:"col-9 p-0",key:"custom_field_values",fieldGroupClassName:"ant-row mx-0 row align-items-end mt-2",fieldGroup:o}]}],this.formConfig.fields=[...this.formConfig.fields,{key:"custom_field_values",fieldGroup:o,hide:!0}]}submitCustomerForm(){const e={...this.formConfig.model.customer_data},o=this.formConfig.model.customer_attachments,l=this.formConfig.model.customer_addresses,s=this.formConfig.model.custom_field_values;if(!e)return void console.error("Customer data is missing.");const a=this.constructCustomFieldsPayload(s),r={customer_data:e,customer_addresses:l,customer_attachments:o,custom_field:a.custom_field,custom_field_values:a.custom_field_values};console.log("Final Payload:",r),this.http.post("customers/customers/",r).subscribe(_=>{this.showSuccessToast=!0,this.toastMessage="Record Created successfully",this.ngOnInit(),setTimeout(()=>{this.showSuccessToast=!1},3e3)},_=>{console.error("Error creating customer and custom fields:",_)})}showDialog(){const e=document.getElementById("customDialog");e&&(e.style.display="flex")}closeDialog(){const e=document.getElementById("customDialog");e&&(e.style.display="none")}constructCustomFieldsPayload(e){if(!e)return console.warn("No custom field values provided."),{custom_field:{},custom_field_options:[],custom_field_values:[]};const o=[],l=[];return Object.keys(e).forEach(s=>{const a=this.customFieldMetadata[s.toLowerCase()]||{};a.is_required&&(""===e[s]||null==e[s])&&l.push(s),""!==e[s]&&null!=e[s]&&o.push({field_value:e[s],field_value_type:"number"==typeof e[s]?"number":"string",entity_id:a.entity_name||"e1fba6d0-23a0-4ae3-a2df-a6d563510042",custom_field_id:s,custom_id:this.formConfig.model.customer_data.customer_id})}),l.length>0?(console.error("Required fields missing:",l),this.showDialog(),null):{custom_field:Object.keys(e).map(s=>({field_name:s,is_required:this.customFieldMetadata[s.toLowerCase()]?.is_required||!1,validation_rules:this.customFieldMetadata[s.toLowerCase()]?.validation_rules||null,field_type_id:this.customFieldMetadata[s.toLowerCase()]?.field_type_id||null,entity_id:this.customFieldMetadata[s.toLowerCase()]?.entity_id||null})),custom_field_values:o}}applyDomManipulations(e){const o=document.querySelector(e);if(!o)return;Array.from(o.querySelectorAll(".custom-form-list .table th")).forEach(a=>{if("Actions"===a.innerText.trim()){a.style.display="none";const r=Array.from(a.parentElement?.children||[]).indexOf(a);o.querySelectorAll(".custom-form-list .table tbody tr").forEach(N=>{const v=N.children;v[r]&&(v[r].style.display="none")})}});const s=o.querySelector(".custom-form-list .ant-card-head button");s&&s.remove()}ngOnDestroy(){this.observer&&this.observer.disconnect()}hide(){document.getElementById("modalClose").click()}editCustomer(e){this.CustomerEditID=e,this.http.get(`customers/customers/${e}`).subscribe(o=>{o&&o.data&&(console.log("Res in edit : ",o),this.formConfig.model=o.data,this.formConfig.model.customer_id=this.CustomerEditID,o.data.custom_field_values&&(this.formConfig.model.custom_field_values=o.data.custom_field_values.reduce((l,s)=>(l[s.custom_field_id]=s.field_value,l),{})),this.formConfig.pkId="customer_id",this.formConfig.submit.label="Update",this.showForm=!0)},o=>{console.error("Error fetching customer data:",o)}),this.hide()}fetchAndSetCustomFieldValues(e){console.log("customerId in Custom : ",e);const o=`customfields/customfieldvalues/?entity_data_id=${e}`;console.log("URL : ",o),this.http.get(o).subscribe(l=>{if(l?.data){console.log("Repsonse 2: ",l);const s=l.data.reduce((a,r)=>(a[r.custom_field.field_name.toLowerCase()]=r.field_value,a),{});console.log("customFieldValues : ",s),this.formConfig.model.custom_field_values=s,console.log("Mapped Custom Field Values:",this.formConfig.model.custom_field_values)}else console.warn("No custom field values found for the customer."),this.formConfig.model.custom_field_values={}},l=>{console.error("Error fetching custom field values:",l)})}showCustomerListFn(){this.showCustomerList=!0,this.CustomersListComponent?.refreshTable()}updateCustomer(){const e={...this.formConfig.model.customer_data},o=this.formConfig.model.customer_attachments,l=this.formConfig.model.customer_addresses,s=this.formConfig.model.custom_field_values;if(!e)return void console.error("Customer data is missing.");const a=this.constructCustomFieldsPayload(s);console.log("Testing the data in customFieldsPayload: ",a);const r={customer_data:e,customer_addresses:l,customer_attachments:o,custom_field:a.custom_field,custom_field_options:a.custom_field_options,custom_field_values:a.custom_field_values};console.log("Final Payload for Update:",r),this.http.put(`customers/customers/${e.customer_id}/`,r).subscribe(_=>{this.showSuccessToast=!0,this.toastMessage="Record updated successfully",this.ngOnInit(),setTimeout(()=>{this.showSuccessToast=!1},3e3)},_=>{console.error("Error updating customer:",_)})}setFormConfig(){this.CustomerEditID=null,this.formConfig={title:"",formState:{viewMode:!1},showActionBtn:!0,exParams:[],submit:{label:"Submit",submittedFn:()=>{this.CustomerEditID?this.updateCustomer():this.submitCustomerForm()}},reset:{resetFn:()=>{this.ngOnInit()}},model:{customer_data:{},customer_attachments:[],customer_addresses:[{address_type:"Billing"},{address_type:"Shipping"}],custom_field_values:[]},fields:[{fieldGroup:[{className:"col-12 custom-form-card-block p-0",key:"customer_data",fieldGroupClassName:"row m-0 pr-0 responsive-row",fieldGroup:[{className:"col-sm-9 col-12 p-0",fieldGroupClassName:"row m-0 p-0",fieldGroup:[{className:"col-md-4 col-sm-6 col-12",key:"name",type:"input",templateOptions:{label:"Name",placeholder:"Enter Name",required:!0}},{className:"col-md-4 col-sm-6 col-12",key:"print_name",type:"input",templateOptions:{label:"Print Name",placeholder:"Enter Print Name",required:!0}},{className:"col-md-4 col-sm-6 col-12",key:"code",type:"input",templateOptions:{label:"Code",placeholder:"Enter Code",required:!0}},{className:"col-md-4 col-sm-6 col-12",key:"customer_category",type:"select",templateOptions:{label:"Customer Category",dataKey:"customer_category_id",dataLabel:"name",options:[],lazy:{url:"masters/customer_categories/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.customer_data?this.formConfig.model.customer_data.customer_category_id=o.customer_category_id:console.error("Form config or Customer data model is not defined.")})}}},{key:"ledger_account",type:"select",className:"col-md-4 col-sm-6 col-12",templateOptions:{dataKey:"ledger_account_id",dataLabel:"name",label:"Ledger Account",placeholder:"Ledger Account",required:!0,lazy:{url:"customers/ledger_accounts/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{console.log("ledger_account",o),this.formConfig&&this.formConfig.model&&this.formConfig.model.customer_data?this.formConfig.model.customer_data.ledger_account_id=o.ledger_account_id:console.error("Form config or Customer data model is not defined.")})}}},{className:"col-md-4 col-sm-6 col-12",key:"tax_type",type:"select",templateOptions:{label:"Tax Type",placeholder:"Select Tax Type",options:[{value:"Inclusive",label:"Inclusive"},{value:"Exclusive",label:"Exclusive"}],required:!0}}]},{className:"col-sm-3 col-12 p-0",fieldGroupClassName:"ant-row row mx-0 mt-2",fieldGroup:[{key:"picture",type:"file",className:"ta-cell pr-md col d-flex justify-content-md-center pr-0",templateOptions:{label:"Picture",required:!0}}]}]}]},{className:"tab-form-list",type:"tabs",fieldGroup:[{className:"col-12 pb-0",fieldGroupClassName:"field-no-bottom-space",props:{label:"Addresses"},fieldGroup:[{fieldGroupClassName:"",fieldGroup:[{key:"customer_addresses",type:"table",className:"custom-form-list no-ant-card",templateOptions:{tableCols:[{name:"address_type",label:"Address Type"},{name:"address",label:"Address"},{name:"city",label:"City"},{name:"state",label:"State"},{name:"country",label:"Country"},{name:"pin_code",label:"Pin Code"},{name:"phone",label:"Phone"},{name:"email",label:"Email"},{name:"route_map",label:"Route Map"},{name:"longitude",label:"Longitude"},{name:"latitude",label:"Latitude"}]},fieldArray:{fieldGroup:[{key:"address_type",type:"input",className:"custom-select-bold",templateOptions:{label:"Address Type",hideLabel:!0,readonly:!0,required:!0,value:"Billing",attributes:{style:"font-weight: bold; border: none; background-color: transparent; margin-bottom: 10px;"}}},{key:"city",type:"select",templateOptions:{dataKey:"city_id",dataLabel:"city_name",label:"City",placeholder:"city",hideLabel:!0,required:!0,lazy:{url:"masters/city/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{console.log("city",o),this.formConfig&&this.formConfig.model?this.formConfig.model.customer_addresses[e.parent.key].city_id=o.city_id:console.error("Form config or Customer addresses model is not defined.")})}}},{key:"state",type:"select",templateOptions:{dataKey:"state_id",dataLabel:"state_name",label:"State",placeholder:"state",hideLabel:!0,required:!0,lazy:{url:"masters/state/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{console.log("state",o),this.formConfig&&this.formConfig.model?this.formConfig.model.customer_addresses[e.parent.key].state_id=o.state_id:console.error("Form config or Customer addresses model is not defined.")})}}},{key:"country",type:"select",templateOptions:{dataKey:"country_id",dataLabel:"country_name",label:"Country",hideLabel:!0,required:!0,placeholder:"country",lazy:{url:"masters/country/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{console.log("country",o),this.formConfig&&this.formConfig.model?this.formConfig.model.customer_addresses[e.parent.key].country_id=o.country_id:console.error("Form config or Customer addresses model is not defined.")})}}},{type:"input",key:"pin_code",templateOptions:{label:"Pin Code",hideLabel:!0,placeholder:"Pin Code"}},{type:"input",key:"phone",templateOptions:{label:"Phone",hideLabel:!0,placeholder:"Phone"}},{type:"input",key:"email",templateOptions:{label:"Email",hideLabel:!0,placeholder:"email"}},{type:"textarea",key:"address",templateOptions:{label:"Address",hideLabel:!0,placeholder:"Address"}}]}}]}]},{className:"col-12 custom-form-card-block",props:{label:"Account Details"},fieldGroup:[{fieldGroup:[{className:"col-12 p-0",key:"customer_data",fieldGroupClassName:"ant-row row align-items-end mt-3",fieldGroup:[{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"payment_term",type:"select",templateOptions:{label:"Payment Term",dataKey:"payment_term_id",dataLabel:"name",options:[],lazy:{url:"masters/customer_payment_terms/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.customer_data?this.formConfig.model.customer_data.payment_term_id=o.payment_term_id:console.error("Form config or Customer data model is not defined.")})}}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"interest_rate_yearly",type:"input",templateOptions:{label:"Interest Rate Yearly",placeholder:"Enter Interest Rate Yearly",type:"number"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"price_category",type:"select",templateOptions:{label:"Price Category",dataKey:"price_category_id",dataLabel:"name",options:[],lazy:{url:"masters/price_categories/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.customer_data?this.formConfig.model.customer_data.price_category_id=o.price_category_id:console.error("Form config or Customer data model is not defined.")})}}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"credit_limit",type:"input",templateOptions:{label:"Credit Limit",placeholder:"Enter Credit Limit",type:"number"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"max_credit_days",type:"input",templateOptions:{label:"Max Credit Days",placeholder:"Enter Max Credit Days",type:"number"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"is_sub_customer",type:"checkbox",templateOptions:{label:"Is Sub Customer"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"customer_common_for_sales_purchase",type:"checkbox",templateOptions:{label:"Customer common for Sales and Purchase"}}]}]}]},{className:"col-12 pb-0",fieldGroupClassName:"field-no-bottom-space",props:{label:"Social Accounts"},fieldGroup:[{fieldGroupClassName:"",fieldGroup:[{className:"col-12 p-0",key:"customer_data",fieldGroupClassName:"ant-row row align-items-end mt-3",fieldGroup:[{className:"ta-cell pr-md col-lg-3 col-md-4 col-sm-6 col-12",key:"website",type:"input",templateOptions:{label:"Website",placeholder:"Enter Website URL"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"facebook",type:"input",templateOptions:{label:"Facebook",placeholder:"Enter Facebook URL"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"skype",type:"input",templateOptions:{label:"Skype",placeholder:"Enter Skype ID"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"twitter",type:"input",templateOptions:{label:"Twitter",placeholder:"Enter Twitter URL"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"linked_in",type:"input",templateOptions:{label:"LinkedIn",placeholder:"Enter LinkedIn URL"}}]}]}]},{className:"col-12 pb-0",fieldGroupClassName:"field-no-bottom-space",props:{label:"Tax Details"},fieldGroup:[{fieldGroupClassName:"",fieldGroup:[{className:"col-12 p-0",key:"customer_data",fieldGroupClassName:"ant-row row align-items-end mt-3",fieldGroup:[{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"gst_category",type:"select",templateOptions:{label:"GST Category",dataKey:"gst_category_id",dataLabel:"name",options:[],lazy:{url:"masters/gst_categories/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.customer_data?this.formConfig.model.customer_data.gst_category_id=o.gst_category_id:console.error("Form config or Customer data model is not defined.")})}}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"gst",type:"input",templateOptions:{label:"GST No",placeholder:"Enter GST"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"cin",type:"input",templateOptions:{label:"CIN",placeholder:"Enter CIN"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"pan",type:"input",templateOptions:{label:"PAN",placeholder:"Enter PAN"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"gst_suspend",type:"checkbox",templateOptions:{label:"GST Suspend"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"tds_on_gst_applicable",type:"checkbox",templateOptions:{label:"TDS on GST Applicable"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"tds_applicable",type:"checkbox",templateOptions:{label:"TDS Applicable"}}]}]}]},{className:"col-12 pb-0",fieldGroupClassName:"field-no-bottom-space",props:{label:"Transport Details"},fieldGroup:[{fieldGroupClassName:"",fieldGroup:[{className:"col-12 p-0",key:"customer_data",fieldGroupClassName:"ant-row row align-items-end mt-3",fieldGroup:[{className:"col-md-4 col-sm-6 col-12",key:"transporter",type:"select",templateOptions:{label:"Transporter",dataKey:"transporter_id",dataLabel:"name",options:[],lazy:{url:"masters/transporters/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.customer_data?this.formConfig.model.customer_data.transporter_id=o.transporter_id:console.error("Form config or Customer data model is not defined.")})}}},{className:"col-md-4 col-sm-6 col-12",key:"distance",type:"input",templateOptions:{label:"Distance",placeholder:"Enter Distance",type:"number"}}]}]}]},{className:"col-12 px-0 pt-3",props:{label:"Attachments"},fieldGroup:[{fieldGroupClassName:"",fieldGroup:[{className:"col-12 custom-form-card-block w-100 p-0",fieldGroup:[{key:"customer_attachments",type:"file",className:"ta-cell col-12 col-md-6 custom-file-attachement",props:{displayStyle:"files",multiple:!0}}]}]}]},{className:"col-12 custom-form-card-block p-0",fieldGroupClassName:"row m-0 pr-0",props:{label:"Other Details"},fieldGroup:[{className:"col-12 p-0",key:"customer_data",fieldGroupClassName:"ant-row mx-0 row align-items-end mt-2",fieldGroup:[{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"contact_person",type:"input",templateOptions:{label:"Contact Person",placeholder:"Enter Contact Person"}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"firm_status",type:"select",templateOptions:{label:"Firm Status",dataKey:"firm_status_id",dataLabel:"name",options:[],lazy:{url:"masters/firm_statuses/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.customer_data?this.formConfig.model.customer_data.firm_status_id=o.firm_status_id:console.error("Form config or Customer data model is not defined.")})}}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"registration_date",type:"date",defaultValue:this.nowDate(),templateOptions:{label:"Registration Date",placeholder:"Enter Registration Date",type:"date",readonly:!0}},{className:"col-lg-3 col-md-4 col-sm-6 col-12",key:"territory",type:"select",templateOptions:{label:"Territory",dataKey:"territory_id",dataLabel:"name",options:[],lazy:{url:"masters/territory/",lazyOneTime:!0}},hooks:{onChanges:e=>{e.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.customer_data?this.formConfig.model.customer_data.territory_id=o.territory_id:console.error("Form config or Customer data model is not defined.")})}}}]}]}]}]}}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(b.eN),t.Y36(t.sBO))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-customers"]],viewQuery:function(e,o){if(1&e&&t.Gf(y.G,5),2&e){let l;t.iGM(l=t.CRH())&&(o.CustomersListComponent=l.first)}},standalone:!0,features:[t.jDz],decls:28,vars:5,consts:[[1,"customers-component","container-fluid","pt-3"],[1,"customers-banner"],[1,"col-12","px-0",2,"display","flex","justify-content","space-between","align-items","center"],["type","button",1,"btn","pl-0",2,"color","black",3,"click"],["class","custom-heading",4,"ngIf"],["type","button","data-bs-toggle","modal","data-bs-target","#exampleModal",1,"btn","btn-primary",3,"click"],[1,"row","custom-form"],["class","col-12 px-1",4,"ngIf"],["id","exampleModal","tabindex","-1","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade","custom-modal"],[1,"modal-dialog","modal-xl"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],["type","button","id","modalClose","data-bs-dismiss","modal","aria-label","Close",1,"btn-close"],["class","modal-body",4,"ngIf"],[1,"modal-footer"],["type","button","data-bs-dismiss","modal",1,"btn","btn-danger"],["id","customToast","class","toast-message",4,"ngIf"],["id","customDialog",1,"custom-dialog-overlay",2,"display","none"],[1,"custom-dialog-box"],["id","dialogOkButton",3,"click"],[1,"custom-heading"],[1,"col-12","px-1"],[3,"options"],[1,"modal-body"],[1,"custom-list",3,"edit"],["id","customToast",1,"toast-message"],[1,"tick-circle"],[1,"tick-mark"],[1,"toast-message-text"],["onclick","this.parentElement.style.display='none'",1,"toast-close"]],template:function(e,o){1&e&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"button",3),t.NdJ("click",function(){return o.CustomerEditID=null}),t.YNc(4,f,2,0,"span",4),t.YNc(5,g,2,0,"span",4),t.qZA(),t.TgZ(6,"button",5),t.NdJ("click",function(){return o.showCustomerListFn()}),t._uU(7,"Customer List "),t.qZA()()(),t.TgZ(8,"div",6),t.YNc(9,m,2,1,"div",7),t.qZA()(),t.TgZ(10,"div",8)(11,"div",9)(12,"div",10)(13,"div",11)(14,"h5",12),t._uU(15,"Edit Customer List"),t.qZA(),t._UZ(16,"button",13),t.qZA(),t.YNc(17,d,2,0,"div",14),t.TgZ(18,"div",15)(19,"button",16),t._uU(20,"Close"),t.qZA()()()()(),t.YNc(21,u,8,1,"div",17),t.TgZ(22,"div",18)(23,"div",19)(24,"p"),t._uU(25," \u26a0\ufe0f Please fill in all required fields before submitting."),t.qZA(),t.TgZ(26,"button",20),t.NdJ("click",function(){return o.closeDialog()}),t._uU(27,"OK"),t.qZA()()()),2&e&&(t.xp6(4),t.Q6J("ngIf",o.CustomerEditID),t.xp6(1),t.Q6J("ngIf",!o.CustomerEditID),t.xp6(4),t.Q6J("ngIf",o.showForm),t.xp6(8),t.Q6J("ngIf",o.showCustomerList),t.xp6(4),t.Q6J("ngIf",o.showSuccessToast))},dependencies:[C.ez,C.O5,c.l,O.C,y.G],styles:['.custom-form-list[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   th.actions-column[_ngcontent-%COMP%], .custom-form-list[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   td.actions-column[_ngcontent-%COMP%]{display:none!important}.custom-form-list[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:contains("Actions"), .custom-form-list[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   th.actions-column[_ngcontent-%COMP%]{display:none!important}.custom-form-list[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   td.actions-column[_ngcontent-%COMP%], .custom-form-list[_ngcontent-%COMP%]   .ant-card-head[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:first-child{display:none!important}.toast-message[_ngcontent-%COMP%]{position:fixed;top:20px;right:20px;background-color:#fff;color:#0e0d0d;padding:12px 30px;height:60px;width:385px;border-radius:0;box-shadow:0 4px 12px #00000026;display:flex;align-items:center;font-family:Arial,sans-serif;font-size:16px;font-weight:500;z-index:1000;animation:_ngcontent-%COMP%_fadeIn .4s ease-in-out;border:2px solid #dcdcdc}.tick-circle[_ngcontent-%COMP%]{width:23px;height:23px;background-color:#fff;border:2px solid #28a745;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:12px}.tick-mark[_ngcontent-%COMP%]{color:#28a745;font-size:12px;line-height:1}.toast-message-text[_ngcontent-%COMP%]{flex:1;color:#292929;font-size:16px;font-weight:500}.toast-close[_ngcontent-%COMP%]{font-size:16px;color:#494949;cursor:pointer;margin-left:12px}.toast-close[_ngcontent-%COMP%]:hover{color:#000}@keyframes _ngcontent-%COMP%_fadeIn{0%{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@media (max-width: 767px){.customers-component[_ngcontent-%COMP%]{padding:15px!important}}.custom-dialog-overlay[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center;z-index:999}.custom-dialog-box[_ngcontent-%COMP%]{background-color:#fff;padding:20px;border-radius:10px;box-shadow:0 4px 8px #0003;text-align:center;width:300px}.custom-dialog-box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-bottom:20px}.custom-dialog-box[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{padding:10px 20px;background-color:#007bff;color:#fff;border:none;border-radius:5px;cursor:pointer}.custom-dialog-box[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#0056b3}']}),i})()}}]);