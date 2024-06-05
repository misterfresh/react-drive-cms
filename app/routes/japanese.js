import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'

export const Japanese = () => html`
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato&family=Noto+Sans+JP&display=swap'); /*******************import new fonts family*********************/
        .about-content {
            display: block;
        }
        .about-content img.image {
            border-radius: 0%;
            width: 150px;
            border: 0;
            max-width: 100%;
            vertical-align: middle;
            float: left;
            margin-right: 2rem;
        }
        .info-title {
            margin: 30px 0 20px;
            font-size: 3.8rem;
            font-family: 'Noto Sans JP', sans-serif; /**************adding font family attributes***********/
        }
        .info p {
            font-size: 2rem;
            margin: 0 0 30px;
            font-family: 'Noto Sans JP', sans-serif; /**************adding font family attributes***********/
            font-weight: 300; /**************adding font weight********************/
        }
        footer {
            padding: 10px 0;
            font-size: 1.4rem;
            letter-spacing: 1px;
            font-weight: 700;
            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
            text-transform: uppercase;
        }
        footer a.contact {
            text-decoration: none;
            background-color: transparent;
            color: #999;
            border-bottom: none;
            font-size: 1.4rem;
        }
        footer a.contact:hover {
            text-decoration: none;
            background-color: transparent;
            color: #333;
            outline: 0;
            transition: all 0.4s;
            border-bottom: none;
        }
    </style>
    <${Page}
        title="ルリカケス"
        subtitle=""
        description="奄美大島、加計呂麻島、請島、枝手久島の森林に周年生息する。独特のルリ色の羽色をしていることから、目視による識別は容易。鳴き声は、九州以北に生息するカケスに似ており、鳴き声での識別も容易。~BirdSearch JP"
        sidebarImage=${prefixUriIfNeeded('/assets/lidths_jay.jpg')}
        showLinks=${true}
    >
        <div class="about-content">
            
            <div class="info">
                <h1 class="info-title">自己紹介（じこしょうかい）</h1>
                <p> みなさん､ はじめまして。
                    エリーです。
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
        <footer>
            <a
                href="${prefixUriIfNeeded('/home')}"
                class="home"
                onClick=${avoidReload}
            >
                Home
            </a>
        </footer>
    <//>
`
