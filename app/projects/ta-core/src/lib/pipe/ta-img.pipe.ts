import { Pipe, PipeTransform } from '@angular/core';
import { SiteConfigService } from '../services/site-config.service';

@Pipe({
  name: 'taImg'
})
export class TaImgPipe implements PipeTransform {
  constructor(private config: SiteConfigService) {

  }

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.config.CONFIG.cdnPath + value;
  }

}
