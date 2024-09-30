import * as React from 'react';
import { Log, FormDisplayMode } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import styles from './Customers.module.scss';

export interface ICustomersProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
}

const LOG_SOURCE: string = 'Customers';

export default class Customers extends React.Component<ICustomersProps, {}> {
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: Customers mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: Customers unmounted');
  }

  public render(): React.ReactElement<{}> {
    return <div className={styles.customers} />;
  }
}
