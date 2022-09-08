import { AppContext } from "./appcontext";
import { Channel } from "./channel";
import { ChannelInfo } from "./channelinfo";
import { Dispatcher } from "./dispatcher";
import { ProfileHandler } from "./profilehandler";
import { hiveService as VaultService } from "./hiveService"
import { CollectionNames as collections, ScriptingNames as scripts } from "./vault/constants"
import { Logger } from './utils/logger'

const logger = new Logger("Profile")

export class Profile {
    private appContext: AppContext;
    private readonly targetDid: string;
    private readonly userDid: string;
    private vault: VaultService

    public getOwnedChannelCount(): Promise<number> {
        throw new Error("Method not implemented.");
    }

    //创建的channel
    public getOwnedChannels(): Promise<Channel[]> {
        throw new Error("Method not implemented.");
    }

    public queryOwnedChannelCount(): Promise<number> {
        return new Promise<number>( (resolve, _reject) => {
            const filter = {
            }
            const result = this.vault.callScript(collections.CHANNELS, filter,
                this.targetDid, this.appContext.getAppDid())
            //const channels = result.find_message.items
            //resolve(channels.length)
            resolve(result)
        }).catch(error => {
            logger.error('get owned channels count error: ', error)
            throw new Error(error)
        })
    }

    public queryOwnedChannels(): Promise<ChannelInfo[]> {
        return new Promise<Channel[]>((resolve, _reject) => {
            const filter = {
            }
            const result = this.vault.callScript(collections.CHANNELS, filter,
                this.targetDid, this.appContext.getAppDid())
            //return result.find_message.items
            resolve(result)
        }).then(result => {
            let channels = []
            result.forEach(item => {
                const channel = Channel.parseOne(this.targetDid, item)
                channels.push(channel)
            })
            return channels
        }).catch(error => {
            logger.error('get owned channels error: ', error)
            throw new Error(error)
        })
    }

    public queryAndDispatchOwnedChannels(dispatcher: Dispatcher<ChannelInfo>) {
        return this.queryOwnedChannels().then (channels => {
            channels.forEach(item => {
                dispatcher.dispatch(item)
            })
        }).catch (error => {
            throw new Error(error)
        })
    }

    public queryOwnedChannnelById(channelId: string): Promise<ChannelInfo> {
        return new Promise((resolve, _reject) => {
            const params = {
                "channel_id": channelId,
            }
            const result = this.vault.callScript(scripts.SCRIPT_QUERY_CHANNEL_INFO, params,
                this.targetDid, this.appContext.getAppDid())
            //return result.find_message.items
            resolve(result)
        }).then(result => {
            const channelInfo = ChannelInfo.parse(this.targetDid, result[0])
            return channelInfo
        })
    }

    public queryAndDispatchOwnedChannelById(channelId: string, dispatcher: Dispatcher<ChannelInfo>) {
        return this.queryOwnedChannnelById(channelId).then (channel => {
            dispatcher.dispatch(channel)
        }).catch (error => {
            throw new Error(error)
        })
    }

    /**
     * Get the total number of subscribed channels from local storage
     * @returns The number of subscribed channels
     */
    public getSubscriptionCount(): number {
        throw new Error("Method not implemented.");
    }

    public querySubscriptionCount(): Promise<number> {
        return new Promise<number>((resolve, _reject) => {
            const filter = {
            }
            const result = this.vault.callScript(collections.BACKUP_SUBSCRIBEDCHANNELS, filter,
                this.targetDid, this.appContext.getAppDid())
            //const channels = result.find_message.items
            //resolve(channels.length)
            resolve(result)
        }).catch(error => {
            logger.error('query subscription count error: ', error)
            throw new Error(error)
        })
    }

    // 订阅的channels
    public querySubscriptions(earlierThan: number, upperLimit: number): Promise<ChannelInfo[]> {
        return new Promise<Channel[]>((resolve, _reject) => {
            // earlierThan : TODO:
            // upperLimit : TODO:
            const filter = {
            }
            const result = this.vault.callScript(collections.BACKUP_SUBSCRIBEDCHANNELS, filter,
                this.targetDid, this.appContext.getAppDid())
            //return result.find_message.items
            resolve(result)
        }).then(result => {
            let channels = []
            result.forEach(item => {
                const channel = Channel.parseOne(this.targetDid, item)
                channels.push(channel)
            })
            return channels
        }).catch(error => {
            logger.error('query subscription channels error: ', error)
            throw new Error(error)
        })
    }

    public queryAndDispatchSubscriptions(earlierThan: number, upperLimit: number,
        dispatcher: Dispatcher<ChannelInfo>) {

        return this.querySubscriptions(earlierThan, upperLimit).then (channels => {
            channels.forEach(item => {
                dispatcher.dispatch(item)
            })
        }).catch (error => {
            throw new Error(error)
        })
    }
}
