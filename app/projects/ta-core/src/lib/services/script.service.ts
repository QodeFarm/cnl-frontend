import { Injectable } from "@angular/core";
interface Scripts {
    name: string;
    src: string;
    async: boolean;
    loaded?: boolean;
}
export const ScriptStore: Scripts[] = [];


declare var document: any;

@Injectable()
export class ScriptService {

    private scripts: any = {};

    constructor() {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }

    load(scripts: Scripts[]) {
        scripts.forEach((script: any) => {
            script.loaded = false;
            // this.scripts[script.name] = {
            //     loaded: false,
            //     src: script.src
            // };
        });
        var promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScript(script)));
        return Promise.all(promises);
    }

    loadScript(script: Scripts) {
        return new Promise((resolve, reject) => {
            const scriptId = 'twa-script-' + script.name;
            //resolve if already loaded
            var isScriptloaded = document.getElementById(scriptId);
            if (isScriptloaded) {
                //script.loaded = true;
                //resolve({ script: script.name, loaded: true, status: 'Loaded' });
            }
            if (script.loaded) {
                resolve({ script: script.name, loaded: true, status: 'Already Loaded' });
            }
            else {
                //load script 

                let _scriptElement = document.createElement('script');// (isScriptloaded)?document.getElementById(scriptId):document.createElement('script');
                // // console.log('_scriptElement',_scriptElement);
                _scriptElement.type = 'text/javascript';
                _scriptElement.src = script.src;
                _scriptElement.id = scriptId;
                if (script.async)
                    _scriptElement.setAttribute("async", script.async);
                if (_scriptElement.readyState) {  //IE
                    _scriptElement.onreadystatechange = () => {
                        if (_scriptElement.readyState === "loaded" || _scriptElement.readyState === "complete") {
                            _scriptElement.onreadystatechange = null;
                            _scriptElement.loaded = true;
                           
                            resolve({ script: script.name, loaded: true, status: 'Loaded' });
                        }
                    };
                } else {  //Others
                    _scriptElement.onload = () => {
                        script.loaded = true;
                        if(document.querySelectorAll('[id='+scriptId+']') &&  document.querySelectorAll('[id='+scriptId+']').length>0){
                            document.querySelectorAll('[id='+scriptId+']').forEach((element:any,i:number) => {
                                if(i !=0)
                                element.remove();

                            });
                        }
                        resolve({ script: script.name, loaded: true, status: 'Loaded' });
                    };
                }
                
                _scriptElement.onerror = (error: any) => resolve({ script: script.name, loaded: false, status: 'Loaded' });
                // if (!this.isMyScriptLoaded(scriptId)) {
                //     document.getElementsByTagName('head')[0].appendChild(_scriptElement);
                // }

                document.body.appendChild(_scriptElement);
                
                //document.getElementsByTagName('head')[0].appendChild(_scriptElement);

            }
        });
    }
    isMyScriptLoaded(scriptId: any) {
        const scripts = document.getElementsByTagName('head')[0].getElementsByTagName('script');
        let isLodad = false;
        for (let i = scripts.length; i--;) {
            if (scripts[i].id === scriptId) {
                //scripts[i].remove();
                //return true;
                isLodad = true;
            }
        }
        return isLodad;
    }

}