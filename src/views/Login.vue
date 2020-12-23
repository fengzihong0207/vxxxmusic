<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar left-text="< 游客听歌" @click-left="gohome"	/>
    <!-- 登录盒子 -->
    <div class="login-box">
      <!-- 登录提示 -->
      <div class="login-text-tips">
        <div class="welcom">欢迎来到 <span>VXX</span> 音乐</div>
      </div>
      <!-- logo -->
      <div class="logo">
        <img class="autoimg" src="../assets/img/logo.png" alt="">
      </div>
      <!-- 登录框 -->
      <div class="login-form">
        <van-form @submit="loginfunction">
          <van-field
            v-model="userloginmsg.userphone"
            label="手机号"
            placeholder="手机号"
            autocomplete="off"
          />
          <van-field
            v-model="userloginmsg.userpassword"
            :type="islogineyeshow ? 'password' : 'text'"
            label="密码"
            name="密码"
            :right-icon="islogineyeshow ? 'closed-eye' : 'eye-o'"
            autocomplete="off"
            placeholder="6-16位且以字母为开头"
            @click-right-icon="pwdinpshow(0)"
          />
          <div class="login-button">
            <van-button round block type="info" native-type="submit">
              登录
            </van-button>
          </div>
        </van-form>
        <!-- 注册信息 -->
        <div class="register">
          还没有账号? <span @click="regishow">注册账号</span>
        </div>
        <!-- 第三方登录 -->
        <div class="Signthree clearfix">
          <div class="singtext">第三方登录</div>
          <div class="singicon">
            <div
              class="sign-icon-item fl"
              v-for="(item, index) in signthreeicon"
              :key="index"
            >
              <img class="autoimg" :src="item.src" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 注册弹出框 -->
    <div class="regisbox">
      <van-popup v-model="isregishow" round position="bottom" closeable>
        <div class="regismsg">账号注册</div>
        <!-- 注册表单 -->
        <div class="regis-form">
          <van-form>
            <van-field
              v-model="regismessage.regisnickname"
              label="昵称"
              placeholder="昵称"
            />
            <van-field
              v-model="regismessage.regisphone"
              maxlength="11"
              type="number"
              label="手机号"
              placeholder="手机号"
              @input="checkphone"
              :error-message="
                this.regismessage.phonehasuse ? '' : '手机号已注册'
              "
            />
            <van-field
              v-model="regismessage.regispassword"
              :type="iseyeregisshow ? 'password' : 'text'"
              label="密码"
              :right-icon="iseyeregisshow ? 'closed-eye' : 'eye-o'"
              placeholder="密码"
              @click-right-icon="pwdinpshow(1)"
            />
            <!-- 验证码 -->
            <van-field
              v-model="regismessage.regiscode"
              type="number"
              clearable
              label="验证码"
              placeholder="请输入验证码"
            >
              <template #button>
                <van-button
                  size="small"
                  type="primary"
                  @click="Sendcode"
                  :disabled="disabled"
                  :text="
                    !disabled
                      ? '发送验证码'
                      : '' + regismessage.btncount + 's后重新发送'
                  "
                />
              </template>
            </van-field>

            <div style="margin: 16px">
              <van-button
                round
                block
                type="info"
                native-type="submit"
                @click="captchacode"
              >
                提交
              </van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
// 引入样式
import "../assets/less/login.less";

export default {
  name: "Login",
  data() {
    return {
      // 用户登录信息
      userloginmsg: {
        // 手机号
        userphone: "",
        // 密码
        userpassword: "",
      },
      //   第三方图片
      signthreeicon: [
        {
          title: "微信",
          src: require("../assets/img/login/微信.png"),
        },
        {
          title: "QQ",
          src: require("../assets/img/login/QQ.png"),
        },
        {
          title: "微博",
          src: require("../assets/img/login/微博.png"),
        },
      ],
      //   注册弹出框
      isregishow: false,
      //   注册信息
      regismessage: {
        //   注册手机号
        regisphone: "",
        // 手机号已注册
        phonehasuse: true,
        // 注册密码
        regispassword: "",
        // 注册昵称
        regisnickname: "",
        //   验证码信息
        regiscode: "",
        // 注册按钮倒计
        btncount: 60,
      },
      // 控制注册框密码眼睛
      iseyeregisshow: true,
      // 控制登录框密码眼睛
      islogineyeshow: true,
      //   控制注册按钮
      disabled: false,
    };
  },
  methods: {
    //   注册框弹出
    regishow() {
      this.isregishow = true;
    },
    // 注册密码框眼睛闭合
    pwdinpshow(index) {
      if(index == 0){
        this.islogineyeshow = !this.islogineyeshow
      }else if(index == 1){
        this.iseyeregisshow = !this.iseyeregisshow;
      }
    },
    // 表单格式验证
    checkmsg(data) {
      for (let key in data) {
        if (!data[key].reg.test(data[key].value)) {
          // 弹出报错信息
          this.$toast(data[key].errormsg);
          // 表单验证不通过，返回false不进行下一步注册
          return false;
        }
      }
      // 全部格式正确，返回true 执行后台数据获取
      return true;
    },
    // 检测手机号是否已经注册
    checkphone(value) {
      // 如果value长度是11位，则检测是否注册过
      if (value.length == 11) {
        // 发起注册请求
        this.axios({
          // 请求方法类型
          method: "get",
          // 地址
          url: "/cellphone/existence/check",
          // post请求参数，boject
          params: {
            phone: this.regismessage.regisphone,
          },
        })
          .then((result) => {
            if (result.data.exist == -1) {
              this.regismessage.phonehasuse = true;
            } else if (result.data.exist == 2 || 1) {
              this.regismessage.phonehasuse = false;
            }
          })
          .catch((err) => {});
      }
    },
    // 验证码发送功能
    Sendcode() {
      // 手机号已经注册，无法发送信息
      if (!this.regismessage.phonehasuse) {
        this.$toast("手机号已经注册");
        return;
      }
      //  注册信息构造
      let checkphonecode = {
        phone: {
          value: this.regismessage.regisphone,
          errormsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
      };

      //   传递信息检查格式是否正确
      let checkphonecodepas = this.checkmsg(checkphonecode);
      // 信息无措发送验证码
      if (checkphonecodepas) {
        // 发起注册请求
        this.axios({
          // 请求方法类型
          method: "post",
          // 地址
          url: "/captcha/sent",
          // post请求参数，boject
          data: {
            phone: this.regismessage.regisphone,
          },
        })
          .then((result) => {
            console.log(result);
            if (result.data.data == true) {
              this.$toast("验证码发送成功");
              //   按钮60s后点击
              this.disabled = true;
              //   倒计时60s后再发送
              let sendcount = setInterval(() => {
                if (this.regismessage.btncount == 0) {
                  clearInterval(sendcount);
                  this.disabled = false;
                }
                this.regismessage.btncount--;
              }, 1000);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 点击注册按钮功能
    //(1) 验证验证码
    captchacode() {
      this.axios({
        // 请求方法类型
        method: "post",
        // 地址
        url: "/captcha/verify",
        // post请求参数，boject
        data: {
          phone: this.regismessage.regisphone,
          captcha: this.regismessage.regiscode,
        },
      })
        .then((result) => {
          if (result.data.data == true) {
            this.Regisfunction();
          }
        })
        .catch((err) => {
          this.$toast("验证码错误");
        });
    },
    //(2)注册密码验证
    Regisfunction() {
      // 构造信息
      let registerdata = {
        password: {
          value: this.regismessage.regispassword,
          errormsg: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        nickname: {
          value: this.regismessage.regisnickname,
          errormsg: "昵称格式不正确",
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
      };
      //   检测格式
      let registerdatapass = this.checkmsg(registerdata);
      // 返回是真值则提交数据
      if (registerdatapass) {
        // 发起注册请求
        this.axios({
          // 请求方法类型
          method: "post",
          // 地址
          url: "/register/cellphone",

          // post请求参数，boject
          data: {
            captcha: this.regismessage.regiscode,

            phone: this.regismessage.regisphone,

            password: this.regismessage.regispassword,

            nickname: this.regismessage.regisnickname,
          },
        })
          .then((result) => {
            // 弹出注册信息
            if (result.data.code == 200) {
              this.$toast("注册成功");
              this.isregishow = false;
            }
          })
          .catch((err) => {
            this.$toast("该昵称已被占用");
          });
      }
    },

    // 登录验证
    loginfunction() {
      // 构造验证信息
      let logindata = {
        phone: {
          value: this.userloginmsg.userphone,
          errormsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userloginmsg.userpassword,
          errormsg: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      // 把验证信息传输到验证方法中，返回布尔值
      let logindatapass = this.checkmsg(logindata);
      // 返回真值再执行下一步
      if (logindatapass) {
        // 发起注册请求
        this.axios({
          // 请求方法类型
          method: "post",
          // 地址
          url: "/login/cellphone",

          // post请求参数，boject
          data: {
            phone: this.userloginmsg.userphone,

            password: this.userloginmsg.userpassword,
          },
        })
          .then((result) => {
            console.log("登录成功",result)
            if (result.data.code == 502) {
              this.$toast(result.data.msg);
            }else if(result.data.code == 200){
              this.$toast("登录成功")
              setTimeout(() => {
                this.$router.go(-1)
              },1500)
              // 保存token，方便后续操作
              localStorage.setItem('token',result.data.token)
              // 保存用户uid
              localStorage.setItem('uid',result.data.profile.userId)
            }
          })
          .catch((err) => {});
      }
    },
    // 取消登录，返回首页
    gohome(){
      this.$router.push({name:'Home'})
      localStorage.setItem("activeIndex",0)
    }
  },
};
</script>

<style lang="less" scoped>
</style>