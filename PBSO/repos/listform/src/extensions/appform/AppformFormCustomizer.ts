import styles from './AppformFormCustomizer.module.scss';
import { BaseFormCustomizer } from '@microsoft/sp-listview-extensibility';
import * as strings from 'AppformFormCustomizerStrings';

import { FormDisplayMode } from '@microsoft/sp-core-library';
import { SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';

export default class AppformFormCustomizer
  extends BaseFormCustomizer<IAppformFormCustomizerStrings> {
private _item:{
Title?: string;
Adding?: string;


};

private _etag?: string;



public onInit(): Promise<void> {
  if (this.displayMode === FormDisplayMode.New) {
    // we're creating a new item so nothing to load
    return Promise.resolve();
  }

  // load item to display on the form
  return this.context.spHttpClient
    .get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('${this.context.list.title}')/items(${this.context.itemId})`, SPHttpClient.configurations.v1, {
      headers: {
        accept: 'application/json;odata.metadata=none'
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      else {
        return Promise.reject(res.statusText);
      }
    })
    .then(item => {
      this._item = item;
      return Promise.resolve();
    });
}


public render(): void {
  // render view form
  if (this.displayMode === FormDisplayMode.Display) {

    this.domElement.innerHTML =
                  `<div class="${styles.appform}">
                    <label for="title">${strings.Title}</label>
                   
                    <br />
                      ${this._item?.Title}
                      <br />
                      ${this._item?.Adding}
                
                    <br />
                    <input type="button" id="cancel" value="${strings.Close}" />
                  </div>`;

   document.getElementById('cancel')?.addEventListener('click',this._onClose); 
   
  }
  // render new/edit form
  else {
    this.domElement.innerHTML =
                `<div>
                  <label for="title">${strings.Title}</label><br />
                  <input type="text" id="title" value="${this._item?.Title || ''}"/>
                  <input type="text" id="adding" value="${this._item?.Adding || ''}"/>
                  
                  <br />
                  <br />
                  <input type="button" id="save" value="${strings.Save}" />
                  <input type="button" id="cancel" value="${strings.Cancel}" />
                  <br />
                  <br />
                  <div class="${styles.error}">
                  
                  </div>
                </div>`;
                document.getElementById('save')?.addEventListener('click',this._onSave);
                document.getElementById('cancel')?.addEventListener('click',this._onClose);
    
  }
}

private _onClose = async (): Promise<void> =>{

  this.formClosed();
}

  private _onSave = async (): Promise<void> => {
    // disable all input elements while we're saving the item
    this.domElement.querySelectorAll('input').forEach(el => el.setAttribute('disabled', 'disabled'));
    // reset previous error message if any
  
  
    let request: Promise<SPHttpClientResponse>|any ;
    const title: string = (document.getElementById('title') as HTMLInputElement).value;
    const adding: string = (document.getElementById('adding') as HTMLInputElement).value;
  
    switch (this.displayMode) {
      case FormDisplayMode.New:
        request = this._createItem(title,adding);
        break;
      case FormDisplayMode.Edit:
        request = this._updateItem(title,adding);

    }
  
    const res: SPHttpClientResponse = request;
  
    if (res.ok) {
      // You MUST call this.formSaved() after you save the form.
      this.formSaved();
      this.domElement.querySelectorAll('input').forEach(el => el.setAttribute('value',' '));            
    }
    else {
  
      //this.domElement.querySelector(`.${styles.error}`).innerHTML = `An error has occurred while saving the item. Please try again. Error: ${error.error.message}`;
     // this.domElement.querySelector(`.${styles.error}`).innerHTML = `An error has occurred while saving the item. Please try again. Error: ${console.error.toString()}`;
      this.domElement.querySelectorAll('input').forEach(el => el.removeAttribute('disabled'));
    }
  }

  private _createItem(title: string, adding: string): Promise<SPHttpClientResponse> {
    return this.context.spHttpClient
      .post(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('${this.context.list.title}')/items`, SPHttpClient.configurations.v1, {
        headers: {
          'content-type': 'application/json;odata.metadata=none'
        },
        body: JSON.stringify({
          Title: title,
          Adding: adding
        })
      });
      
  }

  private _updateItem(title: string, adding: string): Promise<SPHttpClientResponse> {
  if(typeof(this._etag , undefined))
    this._etag="*";

    return this.context.spHttpClient
      .post(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('${this.context.list.title}')/items(${this.context.itemId})`, SPHttpClient.configurations.v1, {
          headers: {
          'content-type': 'application/json;odata.metadata=none',
           'if-match': this._etag!,       
             'x-http-method': 'MERGE'
          },
        body: JSON.stringify({
          Title: title,
          Adding: adding
        })
        
      });
      
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    super.onDispose();
  }

}
