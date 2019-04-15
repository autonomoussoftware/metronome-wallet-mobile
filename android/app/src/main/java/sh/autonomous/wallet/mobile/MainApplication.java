package sh.autonomous.wallet.mobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.peel.react.rnos.RNOSModule;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import io.sentry.RNSentryPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.keychain.KeychainPackage;
import org.reactnative.camera.RNCameraPackage;
import com.horcrux.svg.SvgPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RNOSModule(),
            new GoogleAnalyticsBridgePackage(),
            new RNSentryPackage(),
            new RNVersionNumberPackage(),
            new ReactNativeRestartPackage(),
            new SplashScreenReactPackage(),
            new KeychainPackage(),
            new RNCameraPackage(),
            new SvgPackage(),
            new RandomBytesPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
