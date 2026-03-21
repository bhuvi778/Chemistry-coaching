import{r as l,D as u,z as e}from"./vendor-odw6NEzg.js";import{d as C,L as N}from"./router-9N5QdaIe.js";const v="https://ace2examz.com/api",S=({blogId:n})=>{const[s,b]=l.useState([]),[m,x]=l.useState(!0),[o,c]=l.useState({userName:"",userEmail:"",comment:""}),[g,i]=l.useState(!1);l.useEffect(()=>{console.log("💬 CommentSection mounted for blogId:",n),h(),window.scrollTo(0,0)},[n]);const h=async()=>{try{x(!0);const a=await u.get(`${v}/comments/blog/${n}`);b(a.data)}catch(a){console.error("Error fetching comments:",a)}finally{x(!1)}},d=async a=>{if(a.preventDefault(),!o.userName||!o.userEmail||!o.comment){alert("Please fill in all fields");return}try{i(!0),await u.post(`${v}/comments`,{blogId:n,...o}),alert("Comment submitted successfully! It will appear after admin approval."),c({userName:"",userEmail:"",comment:""})}catch(t){console.error("Error submitting comment:",t),alert("Error submitting comment. Please try again.")}finally{i(!1)}},p=a=>{const t=new Date(a),f=new Date-t,j=Math.floor(f/6e4),w=Math.floor(f/36e5),y=Math.floor(f/864e5);return j<60?`${j} ${j===1?"minute":"minutes"} ago`:w<24?`${w} ${w===1?"hour":"hours"} ago`:y<7?`${y} ${y===1?"day":"days"} ago`:t.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})};return e.jsxs("div",{className:"glass-panel rounded-xl p-8 border border-gray-700",children:[e.jsxs("h2",{className:"text-3xl font-bold text-white mb-6 flex items-center gap-3",children:[e.jsx("i",{className:"fas fa-comments text-purple-500"}),"Comments (",s.length,")"]}),e.jsxs("div",{className:"mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700",children:[e.jsx("h3",{className:"text-xl font-semibold text-white mb-4",children:"Leave a Comment"}),e.jsxs("form",{onSubmit:d,children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",children:[e.jsx("input",{type:"text",placeholder:"Your Name *",value:o.userName,onChange:a=>c({...o,userName:a.target.value}),className:"px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition",required:!0}),e.jsx("input",{type:"email",placeholder:"Your Email *",value:o.userEmail,onChange:a=>c({...o,userEmail:a.target.value}),className:"px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition",required:!0})]}),e.jsx("textarea",{placeholder:"Write your comment... *",value:o.comment,onChange:a=>c({...o,comment:a.target.value}),rows:"4",className:"w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition resize-none",required:!0}),e.jsx("button",{type:"submit",disabled:g,className:"mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed",children:g?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin mr-2"}),"Submitting..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-paper-plane mr-2"}),"Post Comment"]})}),e.jsxs("p",{className:"mt-2 text-sm text-gray-400",children:[e.jsx("i",{className:"fas fa-info-circle mr-1"}),"Your comment will be visible after admin approval."]})]})]}),m?e.jsx("div",{className:"flex justify-center py-8",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"})}):s.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx("i",{className:"fas fa-comment-slash text-6xl text-gray-600 mb-4"}),e.jsx("p",{className:"text-gray-400 text-lg",children:"No comments yet. Be the first to comment!"})]}):e.jsx("div",{className:"space-y-4",children:s.map(a=>e.jsx("div",{className:"p-5 bg-gray-800/30 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition",children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0",children:e.jsx("i",{className:"fas fa-user text-white text-lg"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("h4",{className:"text-lg font-semibold text-white",children:a.userName}),e.jsxs("span",{className:"text-sm text-gray-400",children:[e.jsx("i",{className:"far fa-clock mr-1"}),p(a.createdAt)]})]}),e.jsx("p",{className:"text-gray-300 leading-relaxed",children:a.comment})]})]})},a._id))})]})},k="https://ace2examz.com/api",D=({blogId:n,blogTitle:s,blogSlug:b})=>{const[m,x]=l.useState(0),[o,c]=l.useState(!1),g=`${window.location.origin}/blog/${b}`;console.log("🔗 ShareButtons mounted:",{blogId:n,blogTitle:s,blogSlug:b});const i=async d=>{try{const p=await u.patch(`${k}/blogs/${n}/share`);x(p.data.shareCount);let a="";const t=encodeURIComponent(g),r=encodeURIComponent(s);switch(d){case"facebook":a=`https://www.facebook.com/sharer/sharer.php?u=${t}`;break;case"twitter":a=`https://twitter.com/intent/tweet?url=${t}&text=${r}`;break;case"linkedin":a=`https://www.linkedin.com/shareArticle?mini=true&url=${t}&title=${r}`;break;case"whatsapp":a=`https://wa.me/?text=${r}%20${t}`;break;default:return}window.open(a,"_blank","width=600,height=400")}catch(p){console.error("Error sharing:",p)}},h=async()=>{try{await navigator.clipboard.writeText(g),c(!0);const d=await u.patch(`${k}/blogs/${n}/share`);x(d.data.shareCount),setTimeout(()=>c(!1),2e3)}catch(d){console.error("Error copying to clipboard:",d)}};return e.jsxs("div",{className:"glass-panel rounded-xl p-6 border border-gray-700",children:[e.jsxs("h3",{className:"text-xl font-bold text-white mb-4 flex items-center gap-2",children:[e.jsx("i",{className:"fas fa-share-alt text-cyan-400"}),"Share this article"]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-3 mb-4",children:[e.jsxs("button",{onClick:()=>i("facebook"),className:"flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium",children:[e.jsx("i",{className:"fab fa-facebook-f"}),e.jsx("span",{children:"Facebook"})]}),e.jsxs("button",{onClick:()=>i("twitter"),className:"flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition font-medium",children:[e.jsx("i",{className:"fab fa-twitter"}),e.jsx("span",{children:"Twitter"})]}),e.jsxs("button",{onClick:()=>i("linkedin"),className:"flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition font-medium",children:[e.jsx("i",{className:"fab fa-linkedin-in"}),e.jsx("span",{children:"LinkedIn"})]}),e.jsxs("button",{onClick:()=>i("whatsapp"),className:"flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium",children:[e.jsx("i",{className:"fab fa-whatsapp"}),e.jsx("span",{children:"WhatsApp"})]}),e.jsxs("button",{onClick:h,className:"flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium col-span-2 md:col-span-1",children:[e.jsx("i",{className:`fas ${o?"fa-check":"fa-copy"}`}),e.jsx("span",{children:o?"Copied!":"Copy Link"})]})]}),m>0&&e.jsxs("div",{className:"text-center text-gray-400 text-sm",children:[e.jsx("i",{className:"fas fa-eye mr-2"}),m," ",m===1?"share":"shares"]})]})},$="https://ace2examz.com/api",L=()=>{const{slug:n}=C(),[s,b]=l.useState(null),[m,x]=l.useState([]),[o,c]=l.useState([]),[g,i]=l.useState(!0),[h,d]=l.useState(null);l.useEffect(()=>{p(),window.scrollTo(0,0)},[n]);const p=async()=>{try{i(!0);const t=Date.now(),f=(await u.get(`${$}/blogs/slug/${n}?_=${t}`)).data;b(f),c(f.faqs||[]);const j=await u.get(`${$}/blogs/related/${n}?limit=4&_=${t}`);x(j.data)}catch(t){console.error("Error fetching blog data:",t)}finally{i(!1)}},a=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});return g?e.jsx("div",{className:"min-h-screen pt-32 pb-20 px-4 flex justify-center items-center",children:e.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"})}):s?e.jsxs("div",{className:"min-h-screen pt-32 pb-20 px-4",children:[e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs(N,{to:"/blogs",className:"inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition",children:[e.jsx("i",{className:"fas fa-arrow-left"}),"Back to Blogs"]}),e.jsxs("div",{className:"mb-8",children:[e.jsx("div",{className:"mb-4",children:e.jsx("span",{className:"px-4 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-full",children:s.category})}),e.jsx("h1",{className:"text-4xl md:text-5xl font-bold text-white mb-6 leading-tight",children:s.title}),e.jsxs("div",{className:"flex flex-wrap items-center gap-4 text-gray-400 mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center",children:e.jsx("i",{className:"fas fa-user text-white"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-500",children:"Written by"}),e.jsx("p",{className:"text-cyan-400 font-medium",children:s.author})]})]}),e.jsx("div",{className:"h-8 w-px bg-gray-700"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-500",children:"Published on"}),e.jsx("p",{className:"text-white",children:a(s.publishedDate)})]}),e.jsx("div",{className:"h-8 w-px bg-gray-700"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("i",{className:"fas fa-eye text-cyan-400"}),e.jsxs("span",{children:[s.views," views"]})]})]}),s.tags&&s.tags.length>0&&e.jsx("div",{className:"flex flex-wrap gap-2",children:s.tags.map((t,r)=>e.jsxs("span",{className:"px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-full",children:["#",t]},r))})]}),s.featuredImage&&e.jsx("div",{className:"mb-10 rounded-xl overflow-hidden",children:e.jsx("img",{src:s.featuredImage,alt:s.title,className:"w-full h-auto object-cover"})}),e.jsx("div",{className:"glass-panel rounded-xl p-8 md:p-12 border border-gray-700 mb-12",children:e.jsx("div",{className:"blog-content prose prose-invert prose-lg max-w-none",dangerouslySetInnerHTML:{__html:s.content}})}),s.videoUrls&&s.videoUrls.length>0&&e.jsxs("div",{className:"mb-12",children:[e.jsxs("h2",{className:"text-3xl font-bold text-white mb-6 flex items-center gap-3",children:[e.jsx("i",{className:"fas fa-video text-purple-500"}),"Related Videos"]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:s.videoUrls.map((t,r)=>e.jsx("div",{className:"glass-panel rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition",children:e.jsx("div",{className:"relative",style:{paddingBottom:"56.25%"},children:e.jsx("iframe",{src:t,className:"absolute top-0 left-0 w-full h-full",frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,title:`Video ${r+1}`})})},r))})]}),s.additionalImages&&s.additionalImages.length>0&&e.jsxs("div",{className:"mb-12",children:[e.jsxs("h2",{className:"text-3xl font-bold text-white mb-6 flex items-center gap-3",children:[e.jsx("i",{className:"fas fa-images text-cyan-500"}),"Image Gallery"]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:s.additionalImages.map((t,r)=>e.jsxs("div",{className:"group relative overflow-hidden rounded-xl border border-gray-700 hover:border-cyan-500 transition cursor-pointer",children:[e.jsx("img",{src:t,alt:`Gallery image ${r+1}`,className:"w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4",children:e.jsxs("p",{className:"text-white text-sm",children:[e.jsx("i",{className:"fas fa-search-plus mr-2"}),"Click to view"]})})]},r))})]}),o.length>0&&e.jsxs("div",{className:"glass-panel rounded-xl p-8 border border-gray-700 mb-12",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[e.jsx("i",{className:"fas fa-question-circle text-cyan-500 text-2xl"}),e.jsx("h2",{className:"text-2xl font-bold text-white",children:"Frequently Asked Questions"})]}),e.jsx("div",{className:"space-y-3",children:o.map((t,r)=>e.jsxs("div",{className:"border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition",children:[e.jsxs("button",{onClick:()=>d(h===r?null:r),className:"w-full p-4 bg-gray-800/50 hover:bg-gray-800 transition text-left flex items-center justify-between gap-3",children:[e.jsxs("div",{className:"flex items-start gap-3 flex-1",children:[e.jsx("div",{className:"w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5",children:e.jsxs("span",{className:"text-cyan-400 font-bold text-sm",children:["Q",r+1]})}),e.jsx("p",{className:"text-white font-medium flex-1",children:t.question})]}),e.jsx("i",{className:`fas fa-chevron-${h===r?"up":"down"} text-gray-400 transition-transform`})]}),h===r&&e.jsx("div",{className:"p-4 bg-gray-900/50 border-t border-gray-700",children:e.jsxs("div",{className:"flex gap-3",children:[e.jsx("div",{className:"w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0",children:e.jsx("i",{className:"fas fa-check text-green-400 text-sm"})}),e.jsx("p",{className:"text-gray-300 leading-relaxed flex-1 whitespace-pre-line",children:t.answer})]})})]},t._id||r))})]}),m.length>0&&e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-bold text-white mb-8",children:"Related Articles"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:m.map(t=>e.jsxs(N,{to:`/blog/${t.slug}`,className:"group glass-panel rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20",children:[t.featuredImage&&e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900",children:[e.jsx("img",{src:t.featuredImage,alt:t.title,className:"w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"}),e.jsx("div",{className:"absolute top-3 left-3",children:e.jsx("span",{className:"px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full",children:t.category})})]}),e.jsxs("div",{className:"p-5",children:[e.jsxs("div",{className:"flex items-center gap-2 text-sm text-gray-400 mb-2",children:[e.jsx("span",{className:"px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-medium",children:t.author}),e.jsx("span",{children:"•"}),e.jsx("span",{children:a(t.publishedDate)})]}),e.jsx("h3",{className:"text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition",children:t.title}),e.jsx("p",{className:"text-gray-400 text-sm line-clamp-2 mb-3",children:t.excerpt}),e.jsxs("div",{className:"flex items-center justify-between pt-3 border-t border-gray-700",children:[e.jsxs("div",{className:"flex items-center gap-2 text-sm text-gray-400",children:[e.jsx("i",{className:"fas fa-star text-yellow-500"}),e.jsxs("span",{children:[t.views," views"]})]}),e.jsxs("span",{className:"text-purple-400 font-medium flex items-center gap-2",children:["Read",e.jsx("i",{className:"fas fa-arrow-right"})]})]})]})]},t._id))})]}),e.jsx(D,{blogId:s._id,blogTitle:s.title,blogSlug:s.slug}),e.jsx("div",{className:"mt-12",children:e.jsx(S,{blogId:s._id})})]}),e.jsx("style",{jsx:!0,children:`
        .blog-content {
          color: #e5e7eb;
          line-height: 1.8;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        
        .blog-content * {
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .blog-content h2 {
          color: #06b6d4;
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          word-break: break-word;
        }
        
        .blog-content h3 {
          color: #a855f7;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          word-break: break-word;
        }
        
        .blog-content p {
          margin-bottom: 1rem;
          color: #d1d5db;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        
        .blog-content ul, .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          padding-right: 1rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #d1d5db;
          word-break: break-word;
        }
        
        .blog-content strong {
          color: #ffffff;
          font-weight: 600;
        }
        
        .blog-content a {
          color: #06b6d4;
          text-decoration: underline;
          word-break: break-all;
        }
        
        .blog-content a:hover {
          color: #22d3ee;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #06b6d4;
          padding-left: 1rem;
          padding-right: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #9ca3af;
          word-break: break-word;
        }
        
        .blog-content code {
          background-color: rgba(6, 182, 212, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #06b6d4;
          word-break: break-all;
          overflow-wrap: break-word;
        }
        
        .blog-content pre {
          background-color: #1f2937;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
          max-width: 100%;
        }
        
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
          word-break: normal;
          overflow-wrap: normal;
        }
        
        .blog-content img {
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          max-width: 100%;
          height: auto;
        }
        
        .blog-content iframe {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          max-width: 100%;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          overflow-x: auto;
          display: block;
        }
        
        .blog-content table th,
        .blog-content table td {
          border: 1px solid #374151;
          padding: 0.5rem;
          word-break: break-word;
        }
        
        .blog-content table th {
          background-color: #1f2937;
          color: #06b6d4;
          font-weight: 600;
        }
      `})]}):e.jsx("div",{className:"min-h-screen pt-32 pb-20 px-4",children:e.jsxs("div",{className:"max-w-4xl mx-auto text-center",children:[e.jsx("i",{className:"fas fa-exclamation-circle text-6xl text-red-500 mb-4"}),e.jsx("h1",{className:"text-3xl font-bold text-white mb-4",children:"Blog Not Found"}),e.jsx(N,{to:"/blogs",className:"text-cyan-400 hover:text-cyan-300",children:"← Back to Blogs"})]})})};export{L as default};
