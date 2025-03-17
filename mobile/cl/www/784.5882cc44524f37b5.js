"use strict";(self.webpackChunkcnl=self.webpackChunkcnl||[]).push([[784],{3784:(_,r,n)=>{n.r(r),n.d(r,{BranchesComponent:()=>b});var i=n(6814),c=n(3929),e=n(5879),m=n(7871);let d=(()=>{class a{constructor(){this.edit=new e.vpe,this.tableConfig={apiUrl:"company/branches/",showCheckbox:!0,pkId:"branch_id",pageSize:10,globalSearch:{keys:["name","code","phone","email","address","city_id","state_id","status_id"]},cols:[{fieldKey:"name",name:"Name",sort:!0},{fieldKey:"code",name:"Code",sort:!0},{fieldKey:"phone",name:"Phone",sort:!0},{fieldKey:"email",name:"Email",sort:!0},{fieldKey:"address",name:"Address",sort:!0},{fieldKey:"city_id",name:"City",displayType:"map",mapFn:(t,o,s)=>`${o.city.city_name}`,sort:!0},{fieldKey:"state_id",name:"State",displayType:"map",mapFn:(t,o,s)=>`${o.state.state_name}`,sort:!0},{fieldKey:"status_id",name:"Status",displayType:"map",mapFn:(t,o,s)=>`${o.status.status_name}`,sort:!0},{fieldKey:"code",name:"Action",type:"action",actions:[{type:"delete",label:"Delete",apiUrl:"company/branches"},{type:"callBackFn",icon:"fa fa-pen",label:"",callBackFn:(t,o)=>{this.edit.emit(t.branch_id)}}]}]}}refreshTable(){this.taTableComponent?.refresh()}}return a.\u0275fac=function(t){return new(t||a)},a.\u0275cmp=e.Xpm({type:a,selectors:[["app-branch-list"]],viewQuery:function(t,o){if(1&t&&e.Gf(m.Z,5),2&t){let s;e.iGM(s=e.CRH())&&(o.taTableComponent=s.first)}},outputs:{edit:"edit"},standalone:!0,features:[e.jDz],decls:1,vars:1,consts:[[3,"options"]],template:function(t,o){1&t&&e._UZ(0,"ta-table",0),2&t&&e.Q6J("options",o.tableConfig)},dependencies:[i.ez,c.l,m.Z]}),a})();var p=n(9862),u=n(7127);function f(a,l){1&a&&(e.TgZ(0,"span",17),e._uU(1,"Update Branch"),e.qZA())}function h(a,l){1&a&&(e.TgZ(0,"span",17),e._uU(1,"Create Branch"),e.qZA())}function y(a,l){if(1&a&&(e.TgZ(0,"div",18),e._UZ(1,"ta-form",19),e.qZA()),2&a){const t=e.oxw();e.xp6(1),e.Q6J("options",t.formConfig)}}function g(a,l){if(1&a){const t=e.EpF();e.TgZ(0,"div",20)(1,"app-branch-list",21),e.NdJ("edit",function(s){e.CHM(t);const C=e.oxw();return e.KtG(C.editBranch(s))}),e.qZA()()}}let b=(()=>{class a{constructor(t){this.http=t,this.showBranchList=!1,this.showForm=!1,this.formConfig={}}ngOnInit(){this.showBranchList=!1,this.showForm=!0,this.BranchEditID=null,this.setFormConfig()}hide(){document.getElementById("modalClose").click()}editBranch(t){console.log("event",t),this.BranchEditID=t,this.http.get("company/branches/"+t).subscribe(o=>{o&&(this.formConfig.model=o,this.formConfig.showActionBtn=!0,this.formConfig.pkId="branch_id",this.formConfig.submit.label="Update",this.showForm=!0)}),this.hide()}showBranchListFn(){this.showBranchList=!0,this.BranchListComponent?.refreshTable()}setFormConfig(){this.BranchEditID=null,this.formConfig={url:"company/branches/",formState:{viewMode:!1},showActionBtn:!0,exParams:[{key:"status_id",type:"script",value:"data.status.status_id"},{key:"state_id",type:"script",value:"data.state.state_id"},{key:"city_id",type:"script",value:"data.city.city_id"},{key:"country_id",type:"script",value:"data.country.country_id"},{key:"company_id",type:"script",value:"data.company.company_id"}],submit:{label:"Submit",submittedFn:()=>this.ngOnInit()},reset:{resetFn:()=>{this.ngOnInit()}},model:{},fields:[{fieldGroupClassName:"ant-row custom-form-block px-0 mx-0",className:"p-0",fieldGroup:[{className:"col-md-9 col-12 col-sm-8 p-0",fieldGroupClassName:"ant-row",fieldGroup:[{key:"picture",type:"file",className:"ta-cell col-12 d-sm-none d-block",templateOptions:{label:"picture",required:!0}},{key:"name",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Name",placeholder:"Enter name",required:!0}},{key:"code",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Code",placeholder:"Enter Code",required:!0}},{key:"phone",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Phone",placeholder:"Enter Phone",required:!1}},{key:"email",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Email",placeholder:"Enter email",required:!1}},{key:"city",type:"select",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"City",dataKey:"city",dataLabel:"city_name",options:[],lazy:{url:"masters/city/",lazyOneTime:!0},required:!0},hooks:{onInit:t=>{t.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.city_id?this.formConfig.model.city_id=o.city_id:console.error("Form config or city_id data model is not defined.")})}}},{key:"state",type:"select",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"State",dataKey:"state",dataLabel:"state_name",options:[],lazy:{url:"masters/state/",lazyOneTime:!0},required:!0},hooks:{onInit:t=>{t.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.state_id?this.formConfig.model.state_id=o.state_id:console.error("Form config or state_id data model is not defined.")})}}},{key:"country",type:"select",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Country",dataKey:"country",dataLabel:"country_name",options:[],lazy:{url:"masters/country/",lazyOneTime:!0},required:!1},hooks:{onInit:t=>{t.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.country_id?this.formConfig.model.country_id=o.country_id:console.error("Form config or city_id data model is not defined.")})}}},{key:"pin_code",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"PIN Code",placeholder:"Enter PIN Code",required:!1}},{key:"status",type:"select",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Status",dataKey:"status",dataLabel:"status_name",options:[],lazy:{url:"masters/statuses/",lazyOneTime:!0},required:!0},hooks:{onInit:t=>{t.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.status_id?this.formConfig.model.status_id=o.status_id:console.error("Form config or city_id data model is not defined.")})}}},{key:"longitude",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Longitude",placeholder:"Enter Longitude",required:!1}},{key:"latitude",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Latitude",placeholder:"Enter Latitude",required:!1}},{key:"gst_no",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"GST No",placeholder:"Enter GST No",required:!1}},{key:"e_way_username",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"E-Way Username",placeholder:"Enter E-Way Username",required:!1}},{key:"gstn_username",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"GSTN Username",placeholder:"Enter GSTN Username",required:!1}},{key:"other_license_1",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Other License 1",placeholder:"Enter Other License 1",required:!1}},{key:"other_license_2",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Other License 2",placeholder:"Enter Other License 2",required:!1}},{key:"address",type:"textarea",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"Address",placeholder:"Enter Address",required:!1}},{key:"e_way_password",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"E-Way Password",placeholder:"Enter E-Way Password",required:!1}},{key:"gstn_password",type:"input",className:"col-lg-3 col-md-4 col-sm-6 col-12",templateOptions:{label:"GSTN password",placeholder:"Enter password",required:!1}}]},{className:"col-md-3 col-sm-4 col-12 p-0",fieldGroup:[{key:"picture",type:"file",className:"ta-cell col-12 d-sm-block d-none",templateOptions:{label:"Picture",required:!0}},{key:"company",type:"select",className:"col-12",templateOptions:{label:"Company",dataKey:"company",dataLabel:"name",options:[],lazy:{url:"company/companies/",lazyOneTime:!0},required:!0},hooks:{onInit:t=>{t.formControl.valueChanges.subscribe(o=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.company_id?this.formConfig.model.company_id=o.company_id:console.error("Form config or city_id data model is not defined.")})}}},{key:"allowed_warehouse",type:"input",className:"col-12 mt-",templateOptions:{label:"Allowed Warehouse",placeholder:"Enter Allowed Warehouse",required:!1}}]}]}]}}}return a.\u0275fac=function(t){return new(t||a)(e.Y36(p.eN))},a.\u0275cmp=e.Xpm({type:a,selectors:[["app-branches"]],viewQuery:function(t,o){if(1&t&&e.Gf(d,5),2&t){let s;e.iGM(s=e.CRH())&&(o.BranchListComponent=s.first)}},standalone:!0,features:[e.jDz],decls:21,vars:4,consts:[[1,"container-fluid","p-3"],[1,"branches-banner"],[1,"col-12","px-0",2,"display","flex","justify-content","space-between","align-items","center"],["type","button",1,"btn","pl-0"],["class","custom-heading",4,"ngIf"],["type","button","data-bs-toggle","modal","data-bs-target","#exampleModal",1,"btn","btn-primary",3,"click"],[1,"row","custom-form"],["class","col-12 px-1",4,"ngIf"],["id","exampleModal","tabindex","-1","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade","custom-modal"],[1,"modal-dialog","modal-xl"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],["type","button","id","modalClose","data-bs-dismiss","modal","aria-label","Close",1,"btn-close"],["class","modal-body",4,"ngIf"],[1,"modal-footer"],["type","button","data-bs-dismiss","modal",1,"btn","btn-danger"],[1,"custom-heading"],[1,"col-12","px-1"],[3,"options"],[1,"modal-body"],[1,"custom-list",3,"edit"]],template:function(t,o){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"button",3),e.YNc(4,f,2,0,"span",4),e.YNc(5,h,2,0,"span",4),e.qZA(),e.TgZ(6,"button",5),e.NdJ("click",function(){return o.showBranchListFn()}),e._uU(7," Branch List "),e.qZA()()(),e.TgZ(8,"div",6),e.YNc(9,y,2,1,"div",7),e.qZA()(),e.TgZ(10,"div",8)(11,"div",9)(12,"div",10)(13,"div",11)(14,"h5",12),e._uU(15,"Branch List"),e.qZA(),e._UZ(16,"button",13),e.qZA(),e.YNc(17,g,2,0,"div",14),e.TgZ(18,"div",15)(19,"button",16),e._uU(20,"Close"),e.qZA()()()()()),2&t&&(e.xp6(4),e.Q6J("ngIf",o.BranchEditID),e.xp6(1),e.Q6J("ngIf",!o.BranchEditID),e.xp6(4),e.Q6J("ngIf",o.showForm),e.xp6(8),e.Q6J("ngIf",o.showBranchList))},dependencies:[i.ez,i.O5,c.l,u.C,d]}),a})()}}]);