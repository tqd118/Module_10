(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52210,(e,t,r)=>{"use strict";var o="function"==typeof Symbol&&Symbol.for,n=o?Symbol.for("react.element"):60103,s=o?Symbol.for("react.portal"):60106,c=o?Symbol.for("react.fragment"):60107,a=o?Symbol.for("react.strict_mode"):60108,f=o?Symbol.for("react.profiler"):60114,i=o?Symbol.for("react.provider"):60109,u=o?Symbol.for("react.context"):60110,l=o?Symbol.for("react.async_mode"):60111,y=o?Symbol.for("react.concurrent_mode"):60111,m=o?Symbol.for("react.forward_ref"):60112,p=o?Symbol.for("react.suspense"):60113,d=o?Symbol.for("react.suspense_list"):60120,S=o?Symbol.for("react.memo"):60115,b=o?Symbol.for("react.lazy"):60116,$=o?Symbol.for("react.block"):60121,g=o?Symbol.for("react.fundamental"):60117,h=o?Symbol.for("react.responder"):60118,w=o?Symbol.for("react.scope"):60119;function C(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case n:switch(e=e.type){case l:case y:case c:case f:case a:case p:return e;default:switch(e=e&&e.$$typeof){case u:case m:case b:case S:case i:return e;default:return t}}case s:return t}}}function P(e){return C(e)===y}r.AsyncMode=l,r.ConcurrentMode=y,r.ContextConsumer=u,r.ContextProvider=i,r.Element=n,r.ForwardRef=m,r.Fragment=c,r.Lazy=b,r.Memo=S,r.Portal=s,r.Profiler=f,r.StrictMode=a,r.Suspense=p,r.isAsyncMode=function(e){return P(e)||C(e)===l},r.isConcurrentMode=P,r.isContextConsumer=function(e){return C(e)===u},r.isContextProvider=function(e){return C(e)===i},r.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===n},r.isForwardRef=function(e){return C(e)===m},r.isFragment=function(e){return C(e)===c},r.isLazy=function(e){return C(e)===b},r.isMemo=function(e){return C(e)===S},r.isPortal=function(e){return C(e)===s},r.isProfiler=function(e){return C(e)===f},r.isStrictMode=function(e){return C(e)===a},r.isSuspense=function(e){return C(e)===p},r.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===c||e===y||e===f||e===a||e===p||e===d||"object"==typeof e&&null!==e&&(e.$$typeof===b||e.$$typeof===S||e.$$typeof===i||e.$$typeof===u||e.$$typeof===m||e.$$typeof===g||e.$$typeof===h||e.$$typeof===w||e.$$typeof===$)},r.typeOf=C},79684,(e,t,r)=>{"use strict";t.exports=e.r(52210)},33426,e=>{"use strict";var t=e.i(56354),r=e.i(71645);let o=`
    id
    username
    email
    firstName
    secondName
    profileImage
    description
    bio
`;e.s(["useProfile",0,function(){let[e,n]=(0,r.useState)([]),[s,c]=(0,r.useState)(!1),[a,f]=(0,r.useState)([]),[i,u]=(0,r.useState)([]),[l,y]=(0,r.useState)([]);return{suggestedUsers:e,loading:s,fetchSuggestedUsers:async()=>{c(!0);try{let{suggestedUsers:e}=await (0,t.gql)(`query {
                    suggestedUsers {
                        ${o}
                        photo
                    }
                }`);n(e)}catch(e){throw e instanceof Error?e:Error("Failed to load suggested users")}finally{c(!1)}},fetchMe:async()=>{let{me:e}=await (0,t.gql)(`query {
                me {
                    ${o}
                }
            }`);return e},fetchUserLikes:async()=>{let{meLikes:e}=await (0,t.gql)(`query {
                meLikes {
                    creationDate
                }
            }`);f(e)},fetchUserComments:async()=>{let{meComments:e}=await (0,t.gql)(`query {
                meComments {
                    creationDate
                }
            }`);u(e)},fetchUserPosts:async()=>{let{mePosts:e}=await (0,t.gql)(`query {
                mePosts {
                    creationDate
                }
            }`);y(e)},likes:a,comments:i,posts:l}}])}]);