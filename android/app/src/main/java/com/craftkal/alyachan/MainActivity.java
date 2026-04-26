package com.craftkal.alyachan;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onStart() {
    super.onStart();
    WebView webView = getBridge().getWebView();
    if (webView != null) {
      WebSettings settings = webView.getSettings();
      settings.setJavaScriptEnabled(true);
      settings.setDomStorageEnabled(true);
      settings.setDatabaseEnabled(true);
      settings.setCacheMode(WebSettings.LOAD_DEFAULT);
      settings.setUseWideViewPort(true);
      settings.setLoadWithOverviewMode(true);
      settings.setBuiltInZoomControls(false);
      settings.setDisplayZoomControls(false);
      settings.setMediaPlaybackRequiresUserGesture(false);
      settings.setAllowFileAccess(true);
      settings.setAllowContentAccess(true);
    }
    
    // Enable immersive mode - hide status bar and navigation
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      getWindow().getInsetsController().hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
      getWindow().getInsetsController().setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    } else {
      @SuppressWarnings("DEPRECATION")
      int flags = View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
      getWindow().getDecorView().setSystemUiVisibility(flags);
    }
  }
}
