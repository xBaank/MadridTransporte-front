import {
  AdMob,
  AdmobConsentDebugGeography,
  AdmobConsentStatus,
  type BannerAdOptions,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
} from "@capacitor-community/admob";
const ADID = import.meta.env.VITE_ADID as string;
const isDev = import.meta.env.DEV;
const testDevices = JSON.parse(
  import.meta.env.VITE_TEST_DEVICES ?? [],
) as string[];

export async function banner(): Promise<void> {
  AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
    // Subscribe Banner Event Listener
  });

  const options: BannerAdOptions = {
    adId: ADID,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.TOP_CENTER,
    margin: 0,
    isTesting: isDev,
    // npa: true
  };
  AdMob.showBanner(options);
}

export async function initialize(): Promise<void> {
  await AdMob.initialize({
    initializeForTesting: isDev,
  });

  const options = isDev
    ? {
        debugGeography: AdmobConsentDebugGeography.EEA,
        testDeviceIdentifiers: testDevices,
      }
    : {};

  const [trackingInfo, consentInfo] = await Promise.all([
    AdMob.trackingAuthorizationStatus(),
    AdMob.requestConsentInfo(options),
  ]);

  if (trackingInfo.status === "notDetermined") {
    /**
     * If you want to explain TrackingAuthorization before showing the iOS dialog,
     * you can show the modal here.
     * ex)
     * const modal = await this.modalCtrl.create({
     *   component: RequestTrackingPage,
     * });
     * await modal.present();
     * await modal.onDidDismiss();  // Wait for close modal
     **/

    await AdMob.requestTrackingAuthorization();
  }

  const authorizationStatus = await AdMob.trackingAuthorizationStatus();
  if (
    authorizationStatus.status === "authorized" &&
    Boolean(consentInfo.isConsentFormAvailable) &&
    consentInfo.status === AdmobConsentStatus.REQUIRED
  ) {
    await AdMob.showConsentForm();
  }
}
