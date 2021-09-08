<template>
    <div draggable="true"
         class="dragdiv"
         @dragstart="startDrag"
         @dragend="endDrag">
        <p>fgdhhg</p>
    </div>
</template>

<script>
export default {
    name: 'drag-test',
    methods: {
        // 开始拖动
        startDrag(e) {
            let dt = e.dataTransfer;
            // console.log(e.target.parentNode);
            let body = document.getElementsByTagName('body')[0];
            // let parent = e.target.parentNode;
            body.addEventListener('drop', this.drop);
            body.addEventListener('dragover', this.dragOver);
            /*
             @dragover.prevent="dragOver"
             @drop.prevent="drop"
            */
            dt.effectAllowed = 'move';
            // 必须setData数据，否则不能拖动
            dt.setData('Text', e.target.innerHTML);
            dt.setDragImage(e.target, 0, 0);
            console.log('start')
            // return true;
        },
        // 结束拖动（不管是不是在拖放目标内）
        endDrag(e) {
            let dt = e.dataTransfer;
            dt.dropEffect = 'move';
            console.log('end')
        },
        // 在拖放目标内拖动。必须preventDefault，否则不会发生drop事件
        // 默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，我们必须阻止对元素的默认处理方式。
        dragOver(e) {
            e.preventDefault();
            // console.log('dragOver')
        },
        // 在拖放目标内结束
        // preventDefault() 来避免浏览器对数据的默认处理（drop 事件的默认行为是以链接形式打开）
        drop(e) {
            e.preventDefault();
            let dt = e.dataTransfer;
            console.log('drop')
            console.log(e)
            let data = dt.getData('Text');
        }
    }

}
</script>

<style lang="scss">
.dragdiv {
    position: absolute;
    top: 8rem;
    height: 300px;
    width: 300px;
    z-index: 1000;
    background-color: goldenrod;
}
</style>
