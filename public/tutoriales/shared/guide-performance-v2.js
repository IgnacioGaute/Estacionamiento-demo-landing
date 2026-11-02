/* One seek-safe word clock; authored timing and narration remain unchanged. */
window.EstacionamientoPerformance={optimize:function optimizeCaptions(win){
 const doc=win.document,container=doc.getElementById('guide-speech'),timeline=win.__timelines?.operacion;
 const elements=[...doc.querySelectorAll('.speech-state')];
 if(!container||!timeline||elements.length<2)return;
 const states=elements.map(element=>{const word=element.querySelector('.spoken-current');return{time:Number(element.dataset.captionTime),before:word?element.textContent.slice(0,-word.textContent.length):element.textContent,word:word?.textContent||''}});
 const targets=new Set(elements),at=timeline.time();
 for(const tween of timeline.getChildren(false,true,false)){if(tween.targets?.().some(target=>targets.has(target))){timeline.remove(tween);tween.kill()}}
 const element=doc.createElement('div');element.className='speech-state';element.id='speech-state-active';element.style.cssText='display:block;opacity:1';
 const before=doc.createTextNode(''),wordElement=doc.createElement('span'),word=doc.createTextNode('');wordElement.className='spoken-current';wordElement.appendChild(word);element.append(before,wordElement);container.replaceChildren(element);
 let index=-1,current=0;const clock={};
 Object.defineProperty(clock,'captionPosition',{enumerable:true,configurable:true,get:()=>current,set:value=>{current=value;let low=0,high=states.length;while(low<high){const middle=(low+high)>>>1;if(states[middle].time<=value+1e-6)low=middle+1;else high=middle}const next=Math.max(0,low-1);if(index===next)return;index=next;before.nodeValue=states[next].before;word.nodeValue=states[next].word;win.__captionIndex=next}});
 const duration=Number(doc.querySelector('[data-composition-id="operacion"]').dataset.duration);
 timeline.fromTo(clock,{captionPosition:0},{captionPosition:duration,duration,ease:'none',immediateRender:false},0);timeline.totalTime(at,true);clock.captionPosition=at;
 win.__captionOptimization={states,originalCount:elements.length};
}};
