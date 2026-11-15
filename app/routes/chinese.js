import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'
import { infoPageStyles } from '../styles/infoPage.js'

export const Chinese = () => html`
    <style>
        ${infoPageStyles}
    </style>
    <${Page}
        title="黑臉琵鷺"
        subtitle=""
        description="黑面琵鷺（學名：Platalea minor），又名黑臉琵鷺、小琵鷺、黑面鷺、黑琵鷺、琵琶嘴鷺，俗稱飯匙鳥 ，台灣閩南語稱作「烏面抐桮」 台灣賞鳥人士則俗稱為「黑琵」。
        因其扁平如湯匙狀的長嘴，與中國樂器中的琵琶極為相似，因而得名；亦因其姿態優雅，又有「黑面天使」和「黑面舞者」的雅稱。 ~維基百科"
        sidebarImage=${prefixUriIfNeeded('/assets/black_faced_spoonbill.jpg')}
        showLinks=${true}
        lang="zh-Hant"
    >
        <div class="about-content">
            
            <div class="info">
                <h1 class="info-title">關於我們</h1>
                <p> 
                你好！這是紫墨會的網頁。我是這網頁的創辦人莫妮卡。這是我個人的網誌。
                這網誌建設的原因是本人希望可以傳遞和展示我對鳥類學的熱愛和興趣，以及啟發和鼓勵大眾一起欣賞與保護野生雀鳥及其生態環境。
                但是，隨着本人最近經歷的不同事情，以及本人不斷在發掘和學習新的東西，這個網站發行的博文也不單單只是關於鳥類而已。
                你大概可能會見到本人發行有關鳥類的博文，而另一時間，你大概可能會見到本人發行了有關我最喜愛的城市的博文。
                我的博文可以什麼也是，應有盡有，只有你定期探訪我這個網頁就知道了！
                這網頁程式是用Google Drive為後端，前端展出是用ReactJS, 並且在GitHub上發佈。
                希望您喜歡和享受我寫的博文。如有任何問題，請在這網站留言，謝謝！

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
