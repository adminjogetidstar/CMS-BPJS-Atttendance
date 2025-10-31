export enum TdTypes {
    text = 'text',
    checkbox = 'checkbox',
    actionDetail = 'actionDetail',
    actionEdit = 'actionEdit',
    actionEditDelete = 'actionEditDelete',
    status = 'status',
    dateTime = 'dateTime',
    boolean = 'boolean'
}

export enum ActionTexts {
    actionDetail = 'Detail',
    actionEdit = 'Edit',
    actionEditIcon = 'Edit',
    actionDelete = 'Delete',
}

export interface ITableConfig {
    columnName: string,
    fieldName: string,
    tdType: TdTypes,
    sortable?: boolean,
    checkbox?: boolean,
    width?: string,
}

