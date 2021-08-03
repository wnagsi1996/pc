//fb登录
const fblogin=(FB_CallBackUrl, State, FBClientRedirectDomain, FBDomain,FBid)=>{
		//在主域名被屏蔽的情况下，直接用备用域名的旧模式的登录方式
		if (FB_CallBackUrl.indexOf(FBDomain) != -1 && FBClientRedirectDomain != '') {
			window.location.href = "https://www.facebook.com/dialog/oauth?client_id=" + FBid + "&redirect_uri=" + FBClientRedirectDomain + "/otherauthorize/facebook_bk.aspx&state=" + State + "&scope=public_profile,email";
		}
		else {
			FB.login(function (response) {
				if (response.status === 'connected') {
					window.location.href = FB_CallBackUrl + "?code=" + response.authResponse.accessToken + "&state=" + State;
				} else {
					alert("Login Failed!");
				}
			}, { scope: 'public_profile,email' });
		}
	
}


export {
	fblogin
};