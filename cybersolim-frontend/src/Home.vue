<template>
  <div class="layout">

    <!--导航栏-->
    <div class="menu">
      <div style="margin-left:10px;"><img style=" vertical-align: middle;height: 40px;line-height: 60px;"
                                          src="@/assets/img/egc.jpg" align="middle"/></div>
      <a class="menu-anchor" href="#howItWorks"><span style="display: block;" class="menu-item">HELP</span></a>
      <a class="menu-anchor" href="#progress"><span style="display: block;" class="menu-item">PROGRESS</span></a>
      <a class="menu-anchor" href="#resources"><span style="display: block;" class="menu-item">RESOURCES</span></a>
      <a class="menu-anchor" href="#aboutUs"><span style="display: block;" class="menu-item">ABOUT US</span></a>
      <div class="space"></div>
      <div class="sign-up">
        <Button>SIGN UP</Button>
      </div>
    </div>

    <div id="layout-content" class="layout-content">

      <!--大标题与登录框-->
      <Row type="flex" class="login-banner">
        <i-col :xs="22" :sm="22" :md="12" :lg="12" offset="1" class="main-intro">
          <div class="intro-box">
            <div id="introHeader">
              <div id="easy">Easy</div>
              <div id="geocomputation">&nbsp;Geo-Computation</div>
            </div>
            <div id="introContent">{{intro}}</div>
            <div id="introInclude" style="display: flex;">

              <div class="tag">
                <div class="dot"></div>
                CyberSoLIM
              </div>
              <div class="tag">
                <div class="dot"></div>
                Habitat Suitability Mapping
              </div>
              <div class="tag">
                <div class="dot"></div>
                Digital terrain analysis
              </div>
              <div class="tag">
                <div class="dot"></div>
                SEIMS
              </div>
            </div>
          </div>
        </i-col>

        <i-col :xs="22" :sm="22" :md="10" :lg="9" offset="1" class="login-box">
          <user-login-embeded class="login"></user-login-embeded>
        </i-col>
      </Row>

      <!--系统开发中的声明-->
      <Row type="flex" id="statement" class="brown body-banner-container">
        <i-col span="22" class="col-vertical-center left">
          Dear visitor,
          <br/>
          <br/>Welcomes and thanks for your interest in our EasyGC prototype platform, which is to exemplify our ideas on easy geocomputation.
          <br/>
          <br/>For your convenience, you may try this platform with the following guest account, besides signing up your personal account:
          <br/>email: guest@egc.net
          <br/>password: guest
          <br/>Note that with the guest account, some unpredictable operations may occur, especially multiple users are modeling within the platform with this account.
          <br/>
          <br/>EasyGC prototype platform is being developed, which is yet imperfect. Therefore, we would appreciate if you could contact us through dsm_solim@yahoo.com when you met instability situation in the prototype or want to share your suggestions on our work.
          <br/>In current platform, the algorithms implemented for geographical modeling such as digital soil mapping and habitat suitability mapping are parallel, while the actual execution speed may be limited due to that only a single-node server is currently adopted to execute them (constrained by our limit budget on the computation resources for the prototype platform).
          <br/>
          <br/>Sincerely,
          <br/>EasyGC team
        </i-col>
      </Row>

      <!--solim-->
      <Row type="flex" class="body-banner-container">
          <i-col span="10" offset="1" class="pic-container"><img class="pic left" src="@/assets/img/solim.jpg" alt=""></i-col>
          <i-col :xs="22" :lg="{span:10, offset:1}">
            <div class="body-intro">
              <div class="body-intro-header left">CyberSoLIM</div>
              <ul>
                <li v-for="(item, i) in this.cybersolim">{{item}}</li>
                <li>
                  <div>
                    Demo video:
                    <a :href="this.videos.DSM.bilibili" target="_blank"><img style="height: 20px;line-height: 20px" src="@/assets/img/bilibili.svg"/></a>
                    <a :href="this.videos.DSM.youtube" target="_blank"><img style="height: 15px;line-height: 20px" src="@/assets/img/youtube.png"/></a>
                  </div>
                </li>
              </ul>
            </div>
          </i-col>
      </Row>

      <!--HSM-->
      <Row type="flex" class="body-banner-container">
          <i-col  :xs="{span:22, order:1}" :lg="{span:10, offset:1,order:0}">
            <div class="body-intro">
              <div class="body-intro-header left">HSM</div>
              <ul>
                <li v-for="(item, i) in this.hsm">{{item}}</li>
                <li>
                  <div>
                    Demo video:
                    <a :href="this.videos.HSM.bilibili" target="_blank"><img style="height: 20px;line-height: 20px" src="@/assets/img/bilibili.svg"/></a>
                    <a :href="this.videos.HSM.youtube" target="_blank"><img style="height: 15px;line-height: 20px" src="@/assets/img/youtube.png"/></a>
                  </div>
                </li>
              </ul>
            </div>

          </i-col>
          <i-col :xs="{span:10, offset:1,order:0}" :lg="{span:10, offset:1,order:1}"class="pic-container"><img class="pic right" src="@/assets/img/hsm.png" alt=""></i-col>
      </Row>

      <!--DTA-->
      <Row type="flex" class="body-banner-container">
        <i-col span="10" offset="1" class="pic-container"><img class="pic left" src="@/assets/img/dta.jpg" alt=""></i-col>
        <i-col :xs="22" :lg="{span:10, offset:1}">
          <div class="body-intro">
            <div class="body-intro-header left">DTA</div>
            <ul>
              <li v-for="(item, i) in this.dta">{{item}}</li>
              <li>
                <div>
                  Demo video:
                  <a :href="this.videos.DTA.bilibili" target="_blank"><img style="height: 20px;line-height: 20px" src="@/assets/img/bilibili.svg"/></a>
                  <a :href="this.videos.DTA.youtube" target="_blank"><img style="height: 15px;line-height: 20px" src="@/assets/img/youtube.png"/></a>
                </div>
              </li>
            </ul>
          </div>
        </i-col>
      </Row>

      <!--SEIMS-->
      <Row type="flex" class="body-banner-container">
        <i-col  :xs="{span:22, order:1}" :lg="{span:10, offset:1,order:0}">
          <div class="body-intro">
            <div class="body-intro-header left">SEIMS</div>
            <ul>
              <li v-for="(item, i) in this.seims">{{item}}</li>
            </ul>
          </div>
        </i-col>
        <i-col :xs="{span:10, offset:1,order:0}" :lg="{span:10, offset:1,order:1}"class="pic-container"><img class="pic right" src="@/assets/img/seims.jpg" alt=""></i-col>
      </Row>

      <!--工作流程简介-->
      <Row type="flex" id="howItWorks" class="brown body-banner-container">
        <i-col span="16" class="col-vertical-center">
          <div class="body-intro-header">How it works</div>
          <ul>
            <li>The computation on EGC platform can be generally divided into three steps.</li>
            <li class="bold">
              <div class="dot"></div>
              First, users need to provide the data for the computation.
            </li>
            <li class="bold">
              <div class="dot"></div>
              Then, the platform will intelligently build the model for the computation task.
            </li>
            <li class="bold">
              <div class="dot"></div>
              Finally, users can run the model and view or download the results.
            </li>
<!--deleted in 2021.6.7 by wangyujing-->
<!--            <li>-->
<!--              <div>The detailed operations are described in the&nbsp;<a href="">Help Manual</a>.</div>-->
<!--            </li>-->
          </ul>
        </i-col>
      </Row>

      <!--最近进展-->
      <Row type="flex" id="progress" class="progress-diy body-banner-container">
        <i-col span="18" class="col-vertical-center">
          <div class="body-intro-header left">Recent Progress</div>
          <div class="body-intro-h2 left">Publications</div>
          <table style="margin-left: -120px;" cellspacing="10">

            <tr v-for="item in this.publications" style="font-size: 16px; ">
              <!--若显示的标签过长，则需要加middle类-->
              <th v-if="item.tag.length<13" class="article-tag">
                <Tag color="blue">{{item.tag}}</Tag>
              </th>
              <th v-if="item.tag.length>=13" class="article-tag middle">
                <Tag color="blue">{{item.tag}}</Tag>
              </th>
              <th class="article-content">
                {{item.author}}
                <a :href=item.link>
                  {{ item.title }}.
                </a>
                <i> {{ item.journal }}</i>, {{ item.date }}
              </th>
            </tr>
          </table>

          <div class="body-intro-h2 left">Update Log</div>
          <table style="margin-left: -120px;" cellspacing="10">

            <tr v-for="item in this.updateLog" style="font-size: 16px; ">
              <th class="article-tag middle">
                <Tag color="volcano">{{item.date}}</Tag>
              </th>
              <th class="article-content">
                <p v-for="log in item.updates" style="text-align: left; margin: 0 0 15px 0;">
                  {{log}}<br/>
                </p>
              </th>
            </tr>
          </table>
        </i-col>
      </Row>

      <Row id="resources" type="flex" class="brown body-banner-container">
        <i-col span="18" class="col-vertical-center">
          <div class="body-intro-header left">Resources</div>
          <ul>
            <li v-for="(item, i) in this.resourcesData">
              <a :href="item.link">{{item.resource}}</a>
            </li>
          </ul>
        </i-col>
      </Row>

      <Row id="aboutUs" type="flex" class="body-banner-container">
        <i-col span="18" >
          <div class="body-intro-header left" style="font-size: 22px;">About us</div>
          <div class="body-intro-content" style="font-size: 16px;">The members of EGC Group come from:</div>

          <ul style="text-align: left">
            <li v-for="(item, i) in this.aboutUsData" >
              <a :href="item.link" style="font-size: 16px;">{{item.resource}}</a>
            </li>
            <li style="font-size: 16px; display: inline;">
              The members include:
              <p v-for="(item, i) in this.people" style="display: inline;">
                <a v-if="item.link" :href="item.link">{{item.name}}</a>
                <span v-if="!item.link">{{item.name}}</span>
                <span v-if="i!==people.length-1">&#44;</span>
                <span v-if="i===people.length-1"> ...</span>
              </p>
            </li>
          </ul>

        </i-col>
      </Row>

      <Row class="layout-copy" style="height: 50px;line-height: 30px;background-color: #0f4c81; color: white;">
        <i-col span="6" offset="1">
          <div class="copyright" style="position: relative; float: left;">Copyright &copy; 2016-2021. All rights
            reserved
          </div>
        </i-col>
        <i-col span="5" offset="11">
          <div class="email" style="vertical-align: middle">
            <a href="https://twitter.com/dsmsolim" class="twitter" style="color: #ffffff;">
              <Icon type="logo-twitter" size="26"/>
            </a>
            &nbsp;/&nbsp;dsm_solim@yahoo.com
          </div>
        </i-col>
      </Row>
      <Row style="height: 80px;"></Row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "assets/scss/home";
</style>

<script>
  import UserLoginEmbeded from './components/user/LoginEmbeded'
  export default {
    name: 'home',
    components: {UserLoginEmbeded},
    data() {
      return {
        intro: 'EasyGC stands for the Easy Geo-Computation platform. It aims to provide intelligent model construction process that is easy for users to participate in, as well as efficient computation that is easy to obtain results. ',
        cybersolim: [
          'CyberSoLIM is an online digital soil mapping (DSM) platform. It provides heuristic model building process that allows users to conduct soil mapping easily. ',
          'Users only need to provide the data and build the model for calculating soil maps. The platform will complete the data preparation (such as the derivation of terrain attributes that are needed as environmental covariates in models) and soil mapping in an intelligent way.'
        ],
        dta: [
          'Digital terrain analysis (DTA) provides the intelligent calculation of digital terrain attributes. It provides not only digital terrain analysis tools, but also heuristic building of workflow that generates the target results.'
        ],
        seims: [
          'The SEIMS (Spatially Explicit Integrated Modeling System) module provides intelligent model building of SEIMS model. It helps determine a suitable hydrological model structure for a specific application context using integrated modelling frameworks.'
        ],
        hsm: [
          'The habitat suitability mapping (HSM) module offers intelligent and automated tools for modeling and mapping species habitat suitability from species data and environmental covariates. It has built-in methods that can accommodate the imperfectness of species data (e.g., spatial bias, positional error) to achieve satisfactory mapping accuracy.'
        ],
        videos: {
          DSM:{
            bilibili:'https://www.bilibili.com/video/BV1zK411F743?p=1',
            youtube:'https://www.youtube.com/watch?v=Pmyrt9buVbU',
          },
          DTA:{
            bilibili:'https://www.bilibili.com/video/BV1zK411F743?p=2',
            youtube:'https://www.youtube.com/watch?v=DlBDgP35x_s',
          },
          HSM:{
            bilibili:'https://www.bilibili.com/video/BV1zK411F743?p=3',
            youtube:'https://www.youtube.com/watch?v=8DaBmXMfjBc',
          },
        },
        publications: [
          {
            tag:'EGC',
            author:'Zhu, A. X., Zhao, F. H., Liang, P., & Qin, C. Z.',
            title:'Next generation of GIS: must be easy',
            link:'https://www.tandfonline.com/doi/full/10.1080/19475683.2020.1766563',
            journal:'Annals of GIS',
            date:'2020. doi:10.1080/19475683.2020.1766563.',
          },
          {
            tag:'Watershed Modeling',
            author:'Zhu L-J, Liu J-Z*, Qin C-Z*, Zhu A-X.',
            title:'A modular and parallelized watershed modeling framework',
            link:'https://www.sciencedirect.com/science/article/pii/S1364815218309241',
            journal:'Environmental Modelling & Software',
            date:'2019, 122, 104526. doi: 10.1016/j.envsoft.2019.104526.',
          },
          {
            tag:'Watershed Modeling',
            author:'Jiang J-C, Zhu A-X, Qin C-Z*, Liu J-Z.',
            title:'A knowledge-based method for the automatic determination of hydrological model structures',
            link:'https://iwaponline.com/jh/article-abstract/doi/10.2166/hydro.2019.029/69661/A-knowledge-based-method-for-the-automatic?redirectedFrom=fulltext',
            journal:'Journal of Hydroinformatics',
            date:'2019, 21(6): 1163-1178.',
          },
          {
            tag:'CyberSoLIM',
            author:'Jiang J-C, Zhu A-X*, Qin C-Z, Zhu T, Liu J-Z, Du F, Liu J, Zhang G-M, An Y-M.',
            title:'CyberSoLIM: A cyber platform for digital soil mapping',
            link:'http://www.sciencedirect.com/science/article/pii/S0016706115001329',
            journal:'Geoderma',
            date:'2016, 263: 234-243.',
          },
          {
            tag:'CyberSoLIM',
            author:'Liang P, Qin C-Z*, Zhu A-X, Zhu T-X, Hou Z-W, Fan N-Q, Wang Y-J.',
            title:'Using the most similar case method to automatically select environmental covariates for predictive mapping.',
            link:'https://link.springer.com/article/10.1007/s12145-020-00466-5',
            journal:'Earth Science Informatics',
            date:'2020.',
          },
          {
            tag:'CyberSoLIM',
            author:'Liang P, Qin C-Z*, Zhu A-X, Hou Z-W, Fan N-Q, Wang Y-J.',
            title:'A case-based method of selecting covariates for digital soil mapping.',
            link:'http://www.chinaagrisci.com/Jwk_zgnykxen/EN/abstract/abstract32709.shtml',
            journal:'Journal of Integrative Agriculture',
            date:'2020, 19(8): 2127-2136.',
          },
          {
            tag:'DTA',
            author:'Qin C-Z, Wu X-W, Jiang J-C, Zhu A-X.',
            title:'Case-based knowledge formalization and reasoning method for digital terrain analysis - application to extracting drainage networks',
            link:'http://www.hydrol-earth-syst-sci.net/20/3379/2016/hess-20-3379-2016.html',
            journal:'Hydrology and Earth System Sciences',
            date:'2016, 20: 3379-3392.',
          },
          {
            tag:'HSM',
            author:'Zhang G-M & Zhu A-X.',
            title:'A representativeness-directed approach to mitigate spatial bias in VGI for the predictive mapping of geographic phenomena',
            link:'https://www.tandfonline.com/doi/full/10.1080/13658816.2019.1615071',
            journal:'International Journal of Geographical Information Science',
            date:'2019, 33(9): 1873-1893.',
          },
          {
            tag:'HSM',
            author:'Zhang G-M, Zhu A-X, Huang Z-P, Ren G-P, Qin C-Z, Xiao W.',
            title:'Validity of historical volunteered geographic information: Evaluating citizen data for mapping historical geographic phenomena',
            link:'https://onlinelibrary.wiley.com/doi/10.1111/tgis.12300',
            journal:'Transactions in GIS',
            date:'2018, 22: 149-164.',
          },
          {
            tag:'HSM',
            author:'Zhang G-M, Zhu A-X, Huang Z-P, Xiao W.',
            title:'A heuristic-based approach to mitigating positional errors in patrol data for species distribution modeling',
            link:'https://doi.org/10.1111/tgis.12303',
            journal:'Transactions in GIS',
            date:'2018, 22: 202-216.',
          },
          {
            tag:'HSM',
            author:'Zhu A-X, Zhang G-M, Wang W, Xiao W, Huang Z-P, Dunzhu G-S, Ren G-P, Qin C-Z, Yang L.',
            title:'A citizen data-based approach to predictive mapping of spatial variation of natural phenomena',
            link:'http://dx.doi.org/10.1080/13658816.2015.1058387',
            journal:'International Journal of Geographical Information Science',
            date:'2015, 29:10 1864-1886.',
          },
        ],
        updateLog:[
          {
            date:'2021-5-22',
            updates:[
              'Update the function of models saving and opening',
            ]
          },
          {
            date:'2021-4-15',
            updates:[
              'Update demonstration videos in the homepage.',
              'Standardize some modeling terminologies.',
            ]
          },
          {
            date:'2021-3-11',
            updates:[
              'New feature: Habitat Suitability Mapping (HSM). Mitigating positional errors from patrol data; Representative location selection from citizen data; Habitat mapping based on probability density functions.',
              'New Feature: Data Sharing. Share&subscribe dataset/file with users/groups in EGC website.',
              'New DTA webservices: slope, aspect, planform curvature, profile curvature.',
            ]
          }
        ],
        // updateLog:null,
        resourcesData: [
          {
            resource: 'SoLIM Solution Homepage (standalone digital soil mapping software)',
            link: 'https://solim.geography.wisc.edu/index.htm',
          },
          {
            resource: 'SoLIM Solution Homepage Backup',
            link: 'https://lreis2415.github.io/SoLIMSolutions/index.html',
          },
          {
            resource: 'SoLIM Solution (source code)',
            link: 'https://github.com/lreis2415/SoLIM-Solutions-Source-Code'
          },
          {
            resource: 'SEIMS model (source code)',
            link: 'https://github.com/lreis2415/SEIMS'
          },
        ],
        aboutUsData:[
          {
            resource: "Institute of Geographic Sciences and Natural Resources Research, Chinese Academy of Sciences",
            link: 'http://english.igsnrr.cas.cn/',
          },
          {
            resource: "School of Geography, Nanjing Normal University",
            link: 'http://schools.njnu.edu.cn/geog/'
          },
          {
            resource: "Department of Geography, University of Wisconsin-Madison",
            link: 'https://geography.wisc.edu/'
          },
        ],
        people:[
          {
            name:"A-Xing ZHU",
            link:"https://geography.wisc.edu/profile.php?p=34"
          },
          {
            name:"Cheng-Zhi QIN",
            link:"http://people.ucas.ac.cn/~qincz?language=en"
          },
          {
            name:"Liang-Jun ZHU",
            link:""
          },
          {
            name:"Peng LIANG",
            link:""
          },
          {
            name:"Nai-Qing FAN",
            link:""
          },
          {
            name:"Zhi-Wei HOU",
            link:""
          },
          {
            name:"Yi-Jie WANG",
            link:""
          },
          {
            name:"Fang-He ZHAO",
            link:""
          },
          {
            name:"Shen SHEN",
            link:""
          },
          {
            name:"Rui-Xing YANG",
            link:""
          },
          {
            name:"Yu-Jing WANG",
            link:""
          },
          {
            name:"Tong WU",
            link:""
          },
        ]
      }
    },
    methods:{
    },
    // mounted() {
    //   this.updateLog = require('./assets/updateLog.json');
    //   console.log(this.updateLog)
    // }
  }
</script>
