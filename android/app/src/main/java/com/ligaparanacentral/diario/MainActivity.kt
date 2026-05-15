package com.ligaparanacentral.diario

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
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.floatingactionbutton.FloatingActionButton

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var splashContainer: View
    private lateinit var destello1: View
    private lateinit var fabShare: FloatingActionButton
    private var mediaPlayer: MediaPlayer? = null
    private var pulseAnimation: ObjectAnimator? = null

    private var isPageLoaded = false
    private var isMinTimeElapsed = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        splashContainer = findViewById(R.id.splashContainer)
        destello1 = findViewById(R.id.destello1)
        fabShare = findViewById(R.id.fabShare)

        // Configuración del botón Compartir (FAB)
        fabShare.setOnClickListener {
            val shareIntent = Intent().apply {
                action = Intent.ACTION_SEND
                type = "text/plain"
                putExtra(
                    Intent.EXTRA_TEXT,
                    "¡Descarga la App Oficial del Diario de la Liga Paraná Central! 🏐📱\n\nInstálala gratis desde KSMStore:\n👉 https://ksmstore.vercel.app/"
                )
            }
            startActivity(Intent.createChooser(shareIntent, "Compartir la App via..."))
        }

        // Animación de destellos (pulse effect) detrás del logo
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

        // Reproducir sonido
        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.splash_audio)
            mediaPlayer?.start()
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // Configuración WebView
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                isPageLoaded = true
                checkAndHideSplash()
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                
                // Si el link es de WhatsApp, Facebook o una intención nativa, abrir la app del teléfono
                if (url.startsWith("whatsapp://") || url.contains("facebook.com") || url.startsWith("intent://")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
                
                // De lo contrario, cargar en el WebView normalmente
                return super.shouldOverrideUrlLoading(view, request)
            }
        }
        
        webView.webChromeClient = WebChromeClient()
        
        // Empezar a cargar la página en segundo plano mientras corre el splash
        webView.loadUrl("https://ligaparanacentral.vercel.app/diario")

        // Asegurar que el splash se vea al menos por 3.5 segundos
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
            
            // Mostrar también el botón flotante con una ligera animación
            fabShare.visibility = View.VISIBLE
            fabShare.alpha = 0f
            fabShare.animate().alpha(1f).setDuration(800).start()
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
