import"./getdates-CM6MPNg0.js";const p={BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1},{VITE_JSEARCH_KEY:d}=p;let s=[];const i=JSON.parse(localStorage.getItem("favorites"))||[],r=document.querySelector(".favoriteContainer");if(i.length===0)r.innerHTML="<p>You have no favorite jobs yet!</p>";else{const t=JSON.parse(localStorage.getItem("cachedJobs"))||[];if(t.length>0)c(t,i);else{const o=`https://jsearch.p.rapidapi.com/job-details?job_id=${i.join(",")}&country=all`;fetch(o,{method:"GET",headers:{"x-rapidapi-key":d,"x-rapidapi-host":"jsearch.p.rapidapi.com"}}).then(e=>e.json()).then(e=>{if(s=e.data||[],console.log("Fetched data:",e),!Array.isArray(s))throw new Error("Expected 'jobs' to be an array");localStorage.setItem("cachedJobs",JSON.stringify(s)),c(s,i)}).catch(e=>{console.error("Error fetching jobs data:",e),r.innerHTML="<p>Failed to load your favorite jobs. Please try again later.</p>"})}}function c(t,o){r.innerHTML="";const n=t.filter(e=>o.includes(e.job_id));n.length>0?n.forEach(e=>{const a=document.createElement("div");a.classList.add("job-item"),a.innerHTML=`
                    <div class="employer-logo">
                        <a href="${e.employer_website||"#"}" target="_blank"><img src="${e.employer_logo||""}" alt="${e.employer_name||"Employer Logo"}" loading="lazy" width="60" height="60"></a>
                        <h1>${e.job_title||"No job title available."}</h1>
                    </div>
                    <h2>${e.employer_name||"No employer name available."}</h2>
                    <p>Publisher: ${e.job_publisher||"No information available."}</p>
                    <p>Type: ${e.job_employment_type||"No information available."}</p>
                    <p>Country: ${e.job_country||"No information available."}</p>
                    <p><a href="${e.job_apply_link}" target="_blank">Apply Here</a></p>
                    <p><a href = "${e.job_apply_link}" target = "_blank" >Job Detail</a ></p>`;const l=document.createElement("button");l.classList.add("removeBtn"),l.textContent="Remove",l.setAttribute("data-job-id",e.job_id),a.appendChild(l),r.appendChild(a)}):r.innerHTML="<p>No matching favorite jobs found!</p>"}r.addEventListener("click",function(t){if(t.target&&t.target.classList.contains("removeBtn")){const o=t.target.getAttribute("data-job-id");m(o)}});function m(t){const o=i.filter(a=>a!==t);localStorage.setItem("favorites",JSON.stringify(o));const e=JSON.parse(localStorage.getItem("cachedJobs")).filter(a=>o.includes(a.job_id));localStorage.setItem("cachedJobs",JSON.stringify(e)),c(e,o)}