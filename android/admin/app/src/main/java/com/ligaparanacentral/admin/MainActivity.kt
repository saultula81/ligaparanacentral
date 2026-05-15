package com.ligaparanacentral.admin

import android.animation.ObjectAnimator
import android.animation.PropertyValuesHolder
import android.animation.ValueAnimator
import android.annotation.SuppressLint
import android.content.Intent
import android.media.MediaPlayer
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var splashContainer: View
    private lateinit var destello1: View
    private var mediaPlayer: MediaPlayer? = null
    private var pulseAnimation: ObjectAnimator? = null

    private var isPageLoaded = false
    private var isMinTimeElapsed = false

    // Control de archivos para el WebView (Subida de fotos)
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    
    // El Launcher moderno para manejar el resultado del selector de archivos
    private val fileChooserLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == RESULT_OK) {
            val data = result.data
            val results = if (data?.data != null) arrayOf(data.data!!) else null
            filePathCallback?.onReceiveValue(results)
        } else {
            filePathCallback?.onReceiveValue(null)
        }
        filePathCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        splashContainer = findViewById(R.id.splashContainer)
        destello1 = findViewById(R.id.destello1)

        pulseAnimation = ObjectAnimator.ofPropertyValuesHolder(
            destello1,
            PropertyValuesHolder.ofFloat("scaleX", 0.8f, 1.4f),
            PropertyValuesHolder.ofFloat("scaleY", 0.8f, 1.4f),
            PropertyValuesHolder.ofFloat("alpha", 0.8f, 0.0f)
        ).apply {
            duration = 1500
            repeatCount = ValueAnimator.INFINITE
            repeatMode = ValueAnimator.RESTART
            start()
        }

        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.splash_audio)
            mediaPlayer?.start()
        } catch (e: Exception) {
            e.printStackTrace()
        }

        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.allowFileAccess = true // Necesario para procesar archivos locales en subidas

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                isPageLoaded = true
                checkAndHideSplash()
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                
                if (url.startsWith("whatsapp://") || url.contains("facebook.com") || url.startsWith("intent://")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
                return super.shouldOverrideUrlLoading(view, request)
            }
        }
        
        webView.webChromeClient = object : WebChromeClient() {
            // Sobrescribimos esto para permitir <input type="file">
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                // Cancelamos cualquier callback previo
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback

                // Creamos el intent para seleccionar archivo
                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                }
                
                try {
                    fileChooserLauncher.launch(intent)
                } catch (e: Exception) {
                    this@MainActivity.filePathCallback = null
                    return false
                }
                return true
            }
        }
        
        webView.loadUrl("https://ligaparanacentral.vercel.app/admin")

        Handler(Looper.getMainLooper()).postDelayed({
            isMinTimeElapsed = true
            checkAndHideSplash()
        }, 3500)
    }

    private fun checkAndHideSplash() {
        if (isPageLoaded && isMinTimeElapsed && splashContainer.visibility == View.VISIBLE) {
            splashContainer.animate()
                .alpha(0f)
                .setDuration(800)
                .withEndAction {
                    splashContainer.visibility = View.GONE
                    pulseAnimation?.cancel()
                }
                .start()
                
            webView.visibility = View.VISIBLE
            webView.alpha = 0f
            webView.animate().alpha(1f).setDuration(800).start()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        mediaPlayer?.release()
        mediaPlayer = null
        pulseAnimation?.cancel()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack() && webView.visibility == View.VISIBLE) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
