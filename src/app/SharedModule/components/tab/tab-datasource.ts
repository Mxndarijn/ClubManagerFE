
export interface TabDataSource {
  items: TabItemDataSource[]
  defaultActive: number;
}


export class TabItemDataSource {
  label: string = ""
  onClick?: () => void
  onDeactivate?: () => void

}
