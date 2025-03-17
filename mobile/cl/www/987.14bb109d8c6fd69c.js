"use strict";(self.webpackChunkcnl=self.webpackChunkcnl||[]).push([[987],{8745:(C,_,a)=>{a.d(_,{f:()=>g});var l=a(5879),k=a(6814),d=a(3929),e=a(7871),o=a(2787);let g=(()=>{class c{refreshTable(){this.taTableComponent?.refresh()}constructor(u){this.router=u,this.edit=new l.vpe,this.tableConfig={apiUrl:"tasks/task/",showCheckbox:!0,pkId:"task_id",pageSize:10,globalSearch:{keys:["title","user_id","group_id","description","priority_id","due_date","status_id"]},defaultSort:{key:"created_at",value:"descend"},cols:[{fieldKey:"title",name:"Title",sort:!0},{fieldKey:"user_id",name:"User",displayType:"map",mapFn:(m,r,i)=>`${r.user?.first_name||""}`,sort:!0},{fieldKey:"group_id",name:"group",displayType:"map",mapFn:(m,r,i)=>`${r.group?.group_name||""}`,sort:!0},{fieldKey:"description",name:"Description",sort:!0},{fieldKey:"priority_id",name:"priority",displayType:"map",mapFn:(m,r,i)=>`${r.priority?.priority_name||""}`,sort:!0},{fieldKey:"due_date",name:"Due Date",sort:!0,displayType:"date"},{fieldKey:"status_id",name:"Statuses",displayType:"map",mapFn:(m,r,i)=>`${r.status?.status_name}`,sort:!0},{fieldKey:"code",name:"Action",type:"action",actions:[{type:"delete",label:"Delete",apiUrl:"tasks/task",confirm:!0,confirmMsg:"Sure to delete?"},{type:"callBackFn",icon:"fa fa-pen",label:"",callBackFn:(m,r)=>{console.log(m),this.edit.emit(m.task_id)}}]}]}}}return c.\u0275fac=function(u){return new(u||c)(l.Y36(o.F0))},c.\u0275cmp=l.Xpm({type:c,selectors:[["app-tasks-list"]],viewQuery:function(u,m){if(1&u&&l.Gf(e.Z,5),2&u){let r;l.iGM(r=l.CRH())&&(m.taTableComponent=r.first)}},outputs:{edit:"edit"},standalone:!0,features:[l.jDz],decls:1,vars:1,consts:[[1,"custom-list",3,"options"]],template:function(u,m){1&u&&l._UZ(0,"ta-table",0),2&u&&l.Q6J("options",m.tableConfig)},dependencies:[k.ez,d.l,e.Z]}),c})()},1987:(C,_,a)=>{a.r(_),a.d(_,{TasksComponent:()=>r});var l=a(6814),k=a(3929),d=a(8745),e=a(5879),o=a(9862),g=a(3076),c=a(7127);function p(i,h){1&i&&(e.TgZ(0,"span",17),e._uU(1,"Update Tasks"),e.qZA())}function u(i,h){1&i&&(e.TgZ(0,"span",17),e._uU(1,"Create Tasks"),e.qZA())}function m(i,h){if(1&i){const t=e.EpF();e.TgZ(0,"div",18)(1,"app-tasks-list",19),e.NdJ("edit",function(n){e.CHM(t);const f=e.oxw();return e.KtG(f.editTasks(n))}),e.qZA()()}}let r=(()=>{class i{constructor(t,s){this.http=t,this.userService=s,this.showTasksList=!1,this.showForm=!1,this.formConfig={}}set_default_status_id(){return this.http.get("masters/statuses/").subscribe(t=>{if(t&&t.data){const s="status_name",n="Open",y=t.data.filter(T=>T[s]===n)[0].status_id;this.formConfig.model.task.status_id=y}})}ngOnInit(){this.showTasksList=!1,this.showForm=!1,this.TasksEditID=null,this.setFormConfig(),this.set_default_status_id(),this.formConfig.fields[0].fieldGroup[7].hide=!0;const t=this.userService.getUserId();t&&(this.formConfig.model.task_comments=[{user_id:t,comment_text:""}]),console.log("this.formConfig",this.formConfig)}hide(){document.getElementById("modalClose").click()}editTasks(t){console.log("event",t),this.TasksEditID=t,this.http.get("tasks/task/"+t).subscribe(s=>{if(console.log("--------\x3e res ",s),s&&s.data){this.formConfig.model=s.data,s.data.task.user_id?(this.formConfig.model.task.selectionType="user",this.formConfig.model.task.user_id=s.data.task.user_id):s.data.task.group_id&&(this.formConfig.model.task.selectionType="group",this.formConfig.model.task.group_id=s.data.task.group_id);const n=this.userService.getUserId();s.data.task_comments?(this.formConfig.model.task_comments=s.data.task_comments.map(f=>({...f,comment_text:`By ${f.user.first_name} ${f.user.last_name||""} - ${f.created_at}\n          ${f.comment_text}`,isExisting:!0})),n&&this.formConfig.model.task_comments.push({user_id:n,comment_text:"",isExisting:!1})):n&&(this.formConfig.model.task_comments=[{user_id:n,comment_text:"",isExisting:!1}]),this.formConfig.showActionBtn=!0,this.formConfig.pkId="task_id",this.formConfig.submit.label="Update",this.formConfig.model.task_id=this.TasksEditID,this.showForm=!0,this.formConfig.fields[0].fieldGroup[7].hide=!1}}),this.hide()}showTasksListFn(){this.showTasksList=!0,this.TasksListComponent?.refreshTable()}setFormConfig(){this.TasksEditID=null,this.formConfig={url:"tasks/task/",formState:{viewMode:!1},showActionBtn:!0,exParams:[],submit:{label:"Submit",submittedFn:()=>this.ngOnInit()},reset:{resetFn:()=>{this.ngOnInit()}},model:{task:{},task_comments:[],task_attachments:[],task_history:{}},fields:[{fieldGroupClassName:"ant-row custom-form-block px-0 mx-0",key:"task",fieldGroup:[{key:"title",type:"input",className:"col-md-4 col-sm-6 col-12",templateOptions:{label:"Title",placeholder:"Enter title",required:!0}},{key:"selectionType",type:"radio",className:"col-md-4 col-sm-6 col-12",defaultValue:"user",templateOptions:{label:"Assign to",options:[{label:"User",value:"user"},{label:"Group",value:"group"}],required:!0}},{key:"user",type:"select",className:"col-md-4 col-sm-6 col-12",hideExpression:t=>"user"!==t.selectionType,templateOptions:{label:"User",dataKey:"user_id",dataLabel:"first_name",options:[],lazy:{url:"users/user/",lazyOneTime:!0},required:!0},hooks:{onChanges:t=>{t.formControl.valueChanges.subscribe(s=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.task?this.formConfig.model.task.user_id=s.user_id:console.error("Form config or user data model is not defined.")})}}},{key:"group",type:"select",className:"col-md-4 col-sm-6 col-12",hideExpression:t=>"group"!==t.selectionType,templateOptions:{label:"Group",dataKey:"group_id",dataLabel:"group_name",options:[],lazy:{url:"masters/user_groups/",lazyOneTime:!0},required:!0},hooks:{onChanges:t=>{t.formControl.valueChanges.subscribe(s=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.task?this.formConfig.model.task.group_id=s.group_id:console.error("Form config or group data model is not defined.")})}}},{key:"priority",type:"select",className:"col-md-4 col-sm-6 col-12",templateOptions:{label:"Priorities",dataKey:"priority_id",dataLabel:"priority_name",options:[],lazy:{url:"masters/task_priorities/",lazyOneTime:!0},required:!0},hooks:{onChanges:t=>{t.formControl.valueChanges.subscribe(s=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.task?this.formConfig.model.task.priority_id=s.priority_id:console.error("Form config or priority data model is not defined.")})}}},{key:"description",type:"textarea",className:"col-md-4 col-sm-6 col-12",templateOptions:{label:"Description",placeholder:"Enter description",required:!1}},{key:"due_date",type:"date",className:"col-md-4 col-sm-6 col-12",templateOptions:{type:"date",label:"Due date",required:!1}},{key:"status",type:"select",className:"col-3",templateOptions:{label:"Statuses",dataKey:"status_id",dataLabel:"status_name",options:[],lazy:{url:"masters/statuses/",lazyOneTime:!0},required:!0},hooks:{onChanges:t=>{t.formControl.valueChanges.subscribe(s=>{this.formConfig&&this.formConfig.model&&this.formConfig.model.task?this.formConfig.model.task.status_id=s.status_id:console.error("Form config or statuses data model is not defined.")})}}}]},{className:"tab-form-list",type:"tabs",fieldGroup:[{className:"col-12 pb-0",fieldGroupClassName:"field-no-bottom-space",props:{label:"Task Comments"},fieldGroup:[{fieldGroupClassName:"",fieldGroup:[{key:"task_comments",type:"table",className:"custom-form-list",templateOptions:{addText:"Add Comments",tableCols:[{name:"comment_text",label:"Comment Text"}]},fieldArray:{fieldGroup:[{key:"comment_text",type:"textarea",templateOptions:{label:"Comment Text",placeholder:"Enter Comment Text",hideLabel:!0,required:!0},defaultValue:"",expressionProperties:{"templateOptions.readonly":(t,s)=>t&&!0===t.isExisting}}]}}]}]},{className:"col-12 p-0",props:{label:"Task Attachments"},fieldGroup:[{fieldGroupClassName:"",fieldGroup:[{className:"col-12 custom-form-card-block w-100 p-0",fieldGroup:[{key:"task_attachments",type:"file",className:"ta-cell col-12 col-md-6 custom-file-attachement",props:{displayStyle:"files",multiple:!0}}]}]}]}]}]}}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(o.eN),e.Y36(g.K))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-tasks"]],viewQuery:function(t,s){if(1&t&&e.Gf(d.f,5),2&t){let n;e.iGM(n=e.CRH())&&(s.TasksListComponent=n.first)}},standalone:!0,features:[e.jDz],decls:22,vars:4,consts:[[1,"container-fluid","p-3"],[1,"tasks-banner"],[1,"col-12","px-0",2,"display","flex","justify-content","space-between","align-items","center","flex-wrap","wrap"],["type","button",1,"btn","pl-0",2,"color","black",3,"click"],["class","custom-heading",4,"ngIf"],["type","button","data-bs-toggle","modal","data-bs-target","#tasksListModal",1,"btn","btn-primary",3,"click"],[1,"row","custom-form"],[3,"options"],["id","tasksListModal","tabindex","-1","aria-labelledby","tasksListModalLabel","aria-hidden","true",1,"modal","fade","custom-modal"],[1,"modal-dialog","modal-xl"],[1,"modal-content"],[1,"modal-header"],["id","tasksListModalLabel",1,"modal-title"],["type","button","id","modalClose","data-bs-dismiss","modal","aria-label","Close",1,"btn-close"],["class","modal-body",4,"ngIf"],[1,"modal-footer"],["type","button","data-bs-dismiss","modal",1,"btn","btn-danger"],[1,"custom-heading"],[1,"modal-body"],[1,"custom-list",3,"edit"]],template:function(t,s){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"button",3),e.NdJ("click",function(){return s.TasksEditID=null}),e.YNc(4,p,2,0,"span",4),e.YNc(5,u,2,0,"span",4),e.qZA(),e.TgZ(6,"button",5),e.NdJ("click",function(){return s.showTasksListFn()}),e._uU(7," Tasks List "),e.qZA()()(),e.TgZ(8,"div",6)(9,"div"),e._UZ(10,"ta-form",7),e.qZA()()(),e.TgZ(11,"div",8)(12,"div",9)(13,"div",10)(14,"div",11)(15,"h5",12),e._uU(16,"Edit Tasks List"),e.qZA(),e._UZ(17,"button",13),e.qZA(),e.YNc(18,m,2,0,"div",14),e.TgZ(19,"div",15)(20,"button",16),e._uU(21,"Close"),e.qZA()()()()()),2&t&&(e.xp6(4),e.Q6J("ngIf",s.TasksEditID),e.xp6(1),e.Q6J("ngIf",!s.TasksEditID),e.xp6(5),e.Q6J("options",s.formConfig),e.xp6(8),e.Q6J("ngIf",s.showTasksList))},dependencies:[l.ez,l.O5,k.l,c.C,d.f]}),i})()},3076:(C,_,a)=>{a.d(_,{K:()=>k});var l=a(5879);let k=(()=>{class d{constructor(){this.userId=null,this.username=null,this.firstName=null,this.lastName=null}setUserDetails(o,g,c,p){this.userId=o,this.username=g,this.firstName=c,this.lastName=p,localStorage.setItem("userId",o),localStorage.setItem("username",g),localStorage.setItem("firstName",c),localStorage.setItem("lastName",p),console.log("UserService: setUserDetails called"),console.log("User ID:",this.userId),console.log("Username:",this.username),console.log("First Name:",this.firstName),console.log("Last Name:",this.lastName)}getUserId(){const o=this.userId||localStorage.getItem("userId");return console.log("UserService: getUserId called, returning:",o),o}getUsername(){const o=this.username||localStorage.getItem("username");return console.log("UserService: getUsername called, returning:",o),o}getFirstName(){const o=this.firstName||localStorage.getItem("firstName");return console.log("UserService: getFirstName called, returning:",o),o}getLastName(){const o=this.lastName||localStorage.getItem("lastName");return console.log("UserService: getLastName called, returning:",o),o}clearUserDetails(){console.log("UserService: clearUserDetails called"),this.userId=null,this.username=null,this.firstName=null,this.lastName=null,localStorage.removeItem("userId"),localStorage.removeItem("username"),localStorage.removeItem("firstName"),localStorage.removeItem("lastName")}}return d.\u0275fac=function(o){return new(o||d)},d.\u0275prov=l.Yz7({token:d,factory:d.\u0275fac,providedIn:"root"}),d})()}}]);