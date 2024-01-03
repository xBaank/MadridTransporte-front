import {
  AdMob,
  AdmobConsentDebugGeography,
  AdmobConsentStatus,
  type BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  type AdOptions,
} from "@capacitor-community/admob";

const bannerId = import.meta.env.VITE_BANNERID as string;
const interstitialId = import.meta.env.VITE_INTERSTITIALID as string;
const isDev = import.meta.env.DEV;
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const testDevices = import.meta.env.VITE_TEST_DEVICES
  ? (JSON.parse(import.meta.env.VITE_TEST_DEVICES) as string[])
  : undefined;

export async function banner(): Promise<void> {
  const options: BannerAdOptions = {
    adId: bannerId,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.TOP_CENTER,
    margin: 0,
    isTesting: isDev,
    // npa: true
  };
  AdMob.showBanner(options);
}

export async function interstitial(): Promise<void> {
  const options: AdOptions = {
    adId: interstitialId,
    isTesting: isDev,
    // npa: true
  };
  await AdMob.prepareInterstitial(options);
  await AdMob.showInterstitial();
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
    : undefined;

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
