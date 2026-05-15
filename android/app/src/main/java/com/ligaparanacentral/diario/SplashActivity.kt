package com.ligaparanacentral.diario

import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide

class SplashActivity : AppCompatActivity() {

    private var mediaPlayer: MediaPlayer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        val ivSplashGif = findViewById<ImageView>(R.id.ivSplashGif)
        
        try {
            Glide.with(this)
                .asGif()
                .load(R.raw.splash_anim)
                .into(ivSplashGif)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.splash_audio)
            mediaPlayer?.start()
        } catch (e: Exception) {
            e.printStackTrace()
        }

        Handler(Looper.getMainLooper()).postDelayed({
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }, 3500)
    }

    override fun onDestroy() {
        super.onDestroy()
        mediaPlayer?.release()
        mediaPlayer = null
    }
}
