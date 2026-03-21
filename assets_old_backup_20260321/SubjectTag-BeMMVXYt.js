import{z as r,P as a}from"./vendor-odw6NEzg.js";const n=({subject:s,size:l="md",showIcon:o=!0})=>{const e={"Physical Chemistry":{label:"Physical",color:"purple",bgClass:"bg-purple-500/20",textClass:"text-purple-400",borderClass:"border-purple-500/30",icon:"fa-atom"},"Inorganic Chemistry":{label:"Inorganic",color:"green",bgClass:"bg-green-500/20",textClass:"text-green-400",borderClass:"border-green-500/30",icon:"fa-flask"},"Organic Chemistry":{label:"Organic",color:"orange",bgClass:"bg-orange-500/20",textClass:"text-orange-400",borderClass:"border-orange-500/30",icon:"fa-leaf"},Practical:{label:"Practical",color:"blue",bgClass:"bg-blue-500/20",textClass:"text-blue-400",borderClass:"border-blue-500/30",icon:"fa-microscope"}}[s]||{label:s||"Unknown",bgClass:"bg-gray-500/20",textClass:"text-gray-400",borderClass:"border-gray-500/30",icon:"fa-tag"},t={sm:"px-2 py-0.5 text-xs",md:"px-2.5 py-1 text-xs",lg:"px-3 py-1.5 text-sm"};return r.jsxs("span",{className:`
                inline-flex items-center gap-1.5
                ${t[l]}
                ${e.bgClass}
                ${e.textClass}
                border ${e.borderClass}
                rounded-md font-bold
                whitespace-nowrap
                transition-all duration-200
                hover:scale-105
            `,title:s,children:[o&&r.jsx("i",{className:`fas ${e.icon}`}),r.jsx("span",{children:e.label})]})};n.propTypes={subject:a.string.isRequired,size:a.oneOf(["sm","md","lg"]),showIcon:a.bool};export{n as S};
