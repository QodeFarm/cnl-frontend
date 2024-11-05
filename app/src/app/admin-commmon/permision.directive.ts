import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AdminCommonService } from '../services/admin-common.service';

@Directive({
    selector: '[checkAction]'
})
export class HasPermissionDirective {
    @Input('checkAction') set hasPermission(permission: { moduleName: string; sectionName: string; actionName: string }) {
        const hasAccess = this.checkPermission(permission.moduleName, permission.sectionName, permission.actionName);
        if (hasAccess) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private acs: AdminCommonService
    ) { }

    // Check permission function
    private checkPermission(moduleName: string, sectionName: string, actionName: string): boolean {
        const module = this.acs.accessModuleList.find(mod => mod.module_name === moduleName);
        if (!module) return false;

        const section = module.module_sections.find(sec => sec.section_name === sectionName);
        if (!section) return false;

        return section.actions.some(act => act.action_name === actionName);
    }
}
