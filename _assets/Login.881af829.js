import{r as s,d as a,n as r,k as e,D as o,s as t,b as l,e as n,f as i,y as u,F as d,m as c,x as m,q as f,v as p,o as g,h as b,g as y}from"./index.c184fa68.js";var v=a({name:"Login",setup(){const{updateUser:a}=t.user,l=r(null),n=e({email:"",password:""}),i=r({});return{formRef:l,form:n,login:async()=>{if(!l.value?.checkValidity())return;const r=await async function(a){try{return{status:"ok",data:(await s.post("/users/login",{user:a})).user}}catch(s){return{status:"error",data:s.errors}}}(n);"ok"===r.status?(a(r.data),o("global-feed")):i.value=r.data},errors:i}}});const w={class:"auth-page"},x={class:"container page"},h={class:"row"},k={class:"col-md-6 offset-md-3 col-xs-12"},q=i("h1",{class:"text-xs-center"}," Sign in ",-1),S={class:"text-xs-center"},U=y(" Need an account? "),V={class:"error-messages"},L={class:"form-group","aria-required":"true"},R={class:" form-group"};v.render=function(s,a,r,e,o,t){const y=l("AppLink");return g(),n("div",w,[i("div",x,[i("div",h,[i("div",k,[q,i("p",S,[i(y,{name:"register"},{default:u((()=>[U])),_:1})]),i("ul",V,[(g(!0),n(d,null,c(s.errors,((s,a)=>(g(),n("li",{key:a},b(a)+" "+b(s[0]),1)))),128))]),i("form",{ref:"formRef",onSubmit:a[3]||(a[3]=m(((...a)=>s.login(...a)),["prevent"]))},[i("fieldset",L,[f(i("input",{"onUpdate:modelValue":a[1]||(a[1]=a=>s.form.email=a),class:"form-control form-control-lg",type:"email",required:"",placeholder:"Email"},null,512),[[p,s.form.email]])]),i("fieldset",R,[f(i("input",{"onUpdate:modelValue":a[2]||(a[2]=a=>s.form.password=a),class:"form-control form-control-lg",type:"password",required:"",placeholder:"Password"},null,512),[[p,s.form.password]])]),i("button",{class:"btn btn-lg btn-primary pull-xs-right",disabled:!s.form.email||!s.form.password,type:"submit"}," Sign in ",8,["disabled"])],544)])])])])};export default v;