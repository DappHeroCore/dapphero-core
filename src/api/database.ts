import userbase from 'userbase-js'

export class DB {
  constructor({ appId, projectId }) {
    this.projectId = projectId
    userbase.init({ appId })
  }

  //   async init(): Promise<any> {
  //     return this.userbase.init({ appId: this.appId })
  //   }

  async signUp(details): Promise<any> {
    return userbase.signUp(details)
  }

  async signIn(details): Promise<any> {
    console.log('details', details)
    return userbase.signIn({ ...details })
  }

  async signOut(): Promise<any> {
    return userbase.signOut()
  }

  async forgotPassword(username): Promise<any> {
    return userbase.forgotPassword(username)
  }

  async openDatabase(changeFunc): Promise<any> {
    return userbase.openDatabase({ databaseName: this.projectId, changeHandler: changeFunc })
  }

  async insertItem(item): Promise<any> {
    return userbase.insertItem({ databaseName: this.projectId, item })
  }

  async updateItem(item, itemId): Promise<any> {
    return userbase.updateItem({ databaseName: this.projectId, item, itemId })
  }

  async deleteItem(itemId): Promise<any> {
    return userbase.deleteItem({ databaseName: this.projectId, itemId })
  }

}
