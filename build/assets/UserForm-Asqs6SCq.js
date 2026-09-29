import{j as e}from"./app-ZfbQYt2D.js";import{I as y}from"./InputError-Bg9hUdbS.js";import{c}from"./createLucideIcon-DCqdU8ZL.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13",key:"qkt0x6"}],["path",{d:"M2 12h8.5",key:"ovaggd"}],["path",{d:"M20 6V4a2 2 0 1 0-4 0v2",key:"1of5e8"}],["rect",{width:"8",height:"5",x:"14",y:"6",rx:"1",key:"1fmf51"}]],g=c("globe-lock",b);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],p=c("lock",k);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],$=c("mail",_);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M12 4v16",key:"1654pz"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",key:"e0r10z"}],["path",{d:"M9 20h6",key:"s66wpe"}]],M=c("type",z),t=({name:a,label:n,value:i,onChange:r,error:l,placeholder:o="",required:d=!1,disabled:m=!1,icon:s,type:x="text",helperText:h,className:L="",labelClassName:j="",inputClassName:u="",wrapperClassName:v="",...w})=>{const N=f=>{r(f.target.value)};return e.jsxs("div",{className:`mb-2 ${v}`,children:[n&&e.jsxs("label",{htmlFor:a,className:`form-label ${j}`,children:[n,h&&!l&&e.jsx("span",{id:`${a}-help`,className:"form-text",style:{marginLeft:"8px"},children:h}),d&&e.jsx("span",{className:"text-danger ms-1",children:"*"})]}),e.jsxs("div",{className:"input-group",children:[s&&e.jsx("span",{className:"input-group-text",children:s}),e.jsx("input",{id:a,name:a,type:x,value:i,onChange:N,placeholder:o,disabled:m,className:`
                        form-control
                        ${l?"is-invalid":""}
                        ${u}
                    `.trim(),"aria-describedby":l?`${a}-error`:h?`${a}-help`:void 0,required:d,...w})]}),l&&e.jsx("div",{id:`${a}-error`,className:"invalid-feedback",children:l})]})},I=({data:a,setData:n,errors:i,processing:r,roles:l=[],onDataChange:o,isEdit:d=!1,children:m})=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-6",children:e.jsx(t,{name:"name",label:"Full Name",value:a.name,onChange:s=>o("name",s),error:i.name,placeholder:"John Doe",required:!0,disabled:r,icon:e.jsx(M,{size:16})})}),e.jsx("div",{className:"col-md-6",children:e.jsx(t,{name:"email",label:"Email Address",type:"email",value:a.email,onChange:s=>o("email",s),error:i.email,placeholder:"user@example.com",required:!0,disabled:r,icon:e.jsx($,{size:16}),helperText:d?"Updating email does not send a new password.":"Login credentials will be sent to this email."})})]}),e.jsx("div",{className:"row mt-2",children:e.jsxs("div",{className:"col-6",children:[e.jsxs("label",{className:"form-label d-flex align-items-center gap-2",children:[e.jsx(g,{size:16}),"Role"]}),l.length>0?e.jsxs("select",{className:"form-select",value:a.role||"",onChange:s=>o("role",s.target.value),disabled:r,children:[e.jsx("option",{value:"",children:"Select Role"}),l.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]}):e.jsxs("p",{className:"text-muted mb-0",children:["No roles yet."," ",e.jsx("a",{href:route("roles.create"),children:"Create a role"})," ","first."]}),e.jsx(y,{message:i.role,className:"mt-2"})]})}),d&&e.jsxs("div",{className:"row mt-3",children:[e.jsx("div",{className:"col-md-6",children:e.jsx(t,{name:"password",label:"New Password",type:"password",value:a.password,onChange:s=>o("password",s),error:i.password,placeholder:"Leave blank to keep current",disabled:r,icon:e.jsx(p,{size:16})})}),e.jsx("div",{className:"col-md-6",children:e.jsx(t,{name:"password_confirmation",label:"Confirm Password",type:"password",value:a.password_confirmation,onChange:s=>o("password_confirmation",s),error:i.password_confirmation,placeholder:"Confirm new password",disabled:r,icon:e.jsx(p,{size:16})})})]}),!d&&e.jsx("div",{className:"alert alert-primary mt-2",children:"A secure password will be generated automatically and emailed to the user."}),m]});export{I as default};
