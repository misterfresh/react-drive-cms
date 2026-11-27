import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'
import { infoPageStyles } from '../styles/infoPage.js'

export const Japanese = () => html`
    <style>
        ${infoPageStyles}
    </style>
    <${Page}
        title="ルリカケス"
        subtitle=""
        description="奄美大島、加計呂麻島、請島、枝手久島の森林に周年生息する。独特のルリ色の羽色をしていることから、目視による識別は容易。鳴き声は、九州以北に生息するカケスに似ており、鳴き声での識別も容易。~BirdSearch JP"
        sidebarImage=${prefixUriIfNeeded('/assets/lidths_jay.jpg')}
        birdId="lidths-jay"
        lang="ja"
    >
        <div class="about-content">
            
            <div class="info">
                <h1 class="info-title">自己紹介（じこしょうかい）</h1>
                <p> みなさん､ はじめまして。
                    モニカです。
                    ミネソタ大学を卒业する予定でございます。
                    専门は機械工学です。
                    趣味はプログラミングと人語学習です。
                    青色が好きで、性格が明るいと思います。
                    鳥類が好きです。プリンスの音楽が好きです。
                    好きな食べ物はラーメンで､ 嫌いな食べ物は魚類です。
                    普通、音楽を聴き、歌を歌って、暇のとき、小說を読むこともあるんです。
                    わたしは外国語を勉強するのがすきです。
                    どうぞよろしくお願いします。
                 </p>
                
                
           </div>
        </div>
        <nav class="page-links">
            <a
                href="${prefixUriIfNeeded('/')}"
                class="home"
                onClick=${avoidReload}
            >
                Home
            </a>
        </nav>
    <//>
`
