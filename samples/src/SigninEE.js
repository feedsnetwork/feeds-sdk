import React, {useState} from 'react'
import {RuntimeContext, ChannelInfo, ChannelEntry } from '@feedsnetwork/feeds-sdk-development';
import {
  useNavigate
} from "react-router-dom";

function SigninEE() {
  const navigate = useNavigate();
  const applicationDid = 'did:elastos:iqtWRVjz7gsYhyuQEb1hYNNmWQt1Z9geXg'
  const currentNet = "mainnet".toLowerCase()
  const localDataDir = "/data/store/develop1"
  const resolveCache = '/data/store/catch1'
  RuntimeContext.initialize(applicationDid, currentNet, localDataDir, resolveCache)
  const appCtx = RuntimeContext.getInstance()
  const [login, setLogin] = useState(appCtx.checkSignin());

  const handleSigninEE = async () => {
    const myprofile = await appCtx.signin()
    console.log(`name: ${myprofile.getName()}`);
    console.log(`description: ${myprofile.getDescription()}`);
    const resultCount = await myprofile.queryOwnedChannelCount()
    console.log(`myprofile resultCount: `, resultCount);
    const resultChannels = await myprofile.queryOwnedChannels()
    console.log(`myprofile resultChannels: `, resultChannels);
    await resultChannels.forEach(async (item) => {
      const channelId = item.getChannelId()
      console.log("channelId ==== ", channelId)
      const channelInfo = await myprofile.queryOwnedChannnelById()
      console.log("queryOwnedChannnelById ==== ", channelInfo)
    })
    const subscriptionCount = await myprofile.querySubscriptionCount()
    console.log("subscriptionCount ==== ", subscriptionCount)

    // 1970年： 1663569
    // 现在： 1663569965
    // const subscriptions = await myprofile.querySubscriptions(1663569965, 100)
    // console.log("subscriptions ======================================== ", subscriptions)

    // console.log("开始 create Channel ============================================== ")
    // const name = 'New channel test for feeds js sdk - 5'
    // const displayName = 'New channel test for feeds js sdk - 5'
    // const description = "this is channel's Description - 5"

    // const channelId = ChannelInfo.generateChannelId(myprofile.getUserDid(), name)
    // const newChannelInfo = new ChannelInfo(myprofile.getUserDid(), channelId, name)
    // newChannelInfo.setDisplayName(displayName)
    // newChannelInfo.setDescription(description)
    // newChannelInfo.setReceivingAddress("")
    // newChannelInfo.setAvatar("26eac3c4bfb87d9f027c4810316e56d0@feeds/data/26eac3c4bfb87d9f027c4810316e56d0")
    // newChannelInfo.setCategory("")
    // const time = (new Date()).getTime()
    // newChannelInfo.setCreatedAt(time)
    // newChannelInfo.setUpdatedAt(time)
    // newChannelInfo.setType("public")
    // newChannelInfo.setNft("")
    // newChannelInfo.setProof("")
    // newChannelInfo.setMemo("")
    // const createNewChannel = await myprofile.createChannel(newChannelInfo)
    // console.log("createNewChannel 结束============================================== ", createNewChannel)

    console.log("开始订阅 subscribeChannel ============================================== ")
    const targetDid = 'did:elastos:iUDbUWUFKjzNrnEfK8T2g61M77rbAQpAMj'
    const subChannelId = "149982ed40313750bd044697e74c954ff0af4989274dbfcb53d0ca630095bfbe"
    // const targetDid = myprofile.getUserDid()
    // const subChannelId = channelId
    const subDisplayName = myprofile.getName()
    const status = 0
    const subTime = (new Date()).getTime()
    const chnnelEntry = new ChannelEntry(targetDid, subChannelId, subDisplayName, status)
    chnnelEntry.setCreatedAt(subTime)
    chnnelEntry.setUpdatedAt(subTime)
    const subscribeNewChannel = await myprofile.subscribeChannel(chnnelEntry)
    console.log("订阅结束 subscribeNewChannel ============================================== ", subscribeNewChannel)

    setLogin(appCtx.checkSignin());
  }

  const handleSignout = async () => {
    await appCtx.signout();
    setLogin(appCtx.checkSignin());
  }

  const handleClickButton = (path) => {
    navigate(path);
  }

  return (
    !login ?
    <div>
        <button onClick={handleSigninEE}>Sign in with EE</button>
    </div> :
    <div>
        <button onClick={handleSignout}>Sign out</button>

        <div>
          <button onClick={()=> handleClickButton('/myprofile')}>My Profile</button>
        </div>

    </div>
  );
}

export default SigninEE;
