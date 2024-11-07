import { Pipe, PipeTransform } from '@angular/core';
/*
<button *ngIf="null | hasPermission: 'Tasks': 'Tasks': 'Create'">Add Task</button>

*/
@Pipe({
    name: 'hasPermission'
})
export class HasPermissionPipe implements PipeTransform {

    private accessModuleList = [
        // Add the accessModuleList data here or inject it as a service
    ];

    transform(value: any, moduleName: string, sectionName: string, actionName: string): boolean {
        const module = this.accessModuleList.find(mod => mod.module_name === moduleName);
        if (!module) return false;

        const section = module.module_sections.find(sec => sec.section_name === sectionName);
        if (!section) return false;

        return section.actions.some(act => act.action_name === actionName);
    }
}
