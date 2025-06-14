<template>
       <section class="pt-5 pb-0 position-relative" style="background-image: url(/img/07.jpg); background-repeat: no-repeat; background-size: cover; background-position: top center;">
    <div class="bg-overlay bg-dark opacity-8"></div>
      <!-- Container START -->
      <div class="container">
        <div class="py-5">
          <div class="row position-relative">
            <div class="col-lg-9 mx-auto">
              <div class="text-center" style="color: #fff;">
                <!-- Title -->
                <h1 class="text-white">Find events near you</h1>
                <h6 class="text-white">探索您附近的鸭子、鸭蛋及相关食品、饮品和购物产品的市场。</h6>
              </div>
              <div class="mx-auto bg-mode shadow rounded p-4 mt-5">
                <!-- Form START -->
                <form class="row align-items-end g-4">
                  <!-- Duration -->
                  <div class="col-sm-6 col-lg-3" style="width:25%">
                    <label class="form-label">Select genre</label>
                    <select v-model="idxId" class="form-select js-choice choice-select-text-none" data-position="bottom" data-search-enabled="false">
                      <option value="1">鸭子</option>
                      <option value="2">鸭蛋</option>
                    </select>
                  </div>
                  <!-- Date -->
                  <div class="col-sm-6 col-lg-3" style="width:25%">
                    <label class="form-label">Date from</label>
                    <input type="text" class="form-control flatpickr" value="04/27/2025">
                  </div>
                  <!-- Time -->
                  <div class="col-sm-6 col-lg-3" style="width:25%">
                    <label class="form-label">Date to</label>
                    <input type="text" class="form-control flatpickr" value="04/27/2025">
                  </div>
                  <!-- Time -->
                  <div class="col-sm-6 col-lg-3" style="width:25%">
                    <a class="btn btn-primary w-100" href="#" @click.prevent="handleFilter">Filters Dates</a>
                  </div>
                </form>
                <!-- Form END -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> 
    <div class="container">
        <div class="row g-4">
            <div class="col-md-8 col-lg-6 vstack gap-4">
                <div class="card h-100 table-container">
                            <table class="modern-table">
  <thead>
    <tr>
      <th>时间</th>
      <th>产品/品种</th>
      <th>所在产地</th>
      <th>价格</th>
      <th>升/降</th>
      <th>走势图</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in marketData" :key="item.productId">
                                <td>{{ formatDate(item.time) }}</td>
                                <td>{{ item.product }}</td>
                                <td>{{ item.place }}</td>
                                <td>{{ item.price }}</td>
                                <td :class="{ 'up': item.priceDirection === 'up', 'down': item.priceDirection === 'down' }">
                                    {{ item.priceChangePercent !== 0 ? item.priceChangePercent + '%' : '-' }}
                                </td>
                                <td>
                                    <svg v-if="item.priceDirection === 'up'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-up" viewBox="0 0 16 16">
                                        <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                                    </svg>
                                    <svg v-else-if="item.priceDirection === 'down'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-down" viewBox="0 0 16 16">
                                        <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                                    </svg>
                                    <span v-else><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
</svg></span>
                                </td>
                            </tr>
  </tbody>
</table>
                </div>
            </div>
        </div>

    </div>
    <div class="pagination-wrapper" v-if="marketData.length > 0">
    <svg class="btns btn--prev" :class="{ 'disabled': currentPage === 1 }" height="40" viewbox="0 0 24 24" width="40" xmlns="http://www.w3.org/2000/svg" @click="handlePageChange('prev'),handleClick('prev')">
      <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" transform="scale(2)"></path>
      <path d="M0-.5h24v24H0z" fill="none"></path>
    </svg>

    <div class="pagination-container">
      <div class="little-dot little-dot--first"></div>
      <div class="little-dot">
        <div class="big-dot-container">
          <div class="big-dot"></div>
        </div>
      </div>
      <div class="little-dot little-dot--last"></div>
    </div>

    <svg class="btns btn--next"  height="40" viewbox="0 0 24 24" width="40" xmlns="http://www.w3.org/2000/svg" @click="handlePageChange('next'),handleClick('next')" >
      <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" transform="scale(2)"></path>
      <path d="M0-.25h24v24H0z" fill="none"></path>
    </svg>
  </div>
    <div v-else class="nomore">
      <div class="error__container">
 <div class="error__code"><p>N</p><p>o</p><p>More</p></div>
 <div class="error__title">没有更多内容了</div>
 <div class="error__description"></div>
 <button class="action">返回首页</button>
 </div>
    </div>
</template>
<script setup>
import '@/js/choices.min.js';
import '@/js/functions.js';
import '@/js/flatpickr.min.js';
import '@/js/dropzone.js';
import { onMounted ,ref ,watch} from 'vue';
import axios from 'axios';
import { baseURL } from '@/config/apiConfig';
const currentPage = ref(1);
const marketData = ref([]);
const idxId = ref(1);
const pageSize = 9;
const token=localStorage.getItem('authToken')

const fetchMarketData = async () => {
    try {
      const response = await axios.get(`${baseURL}/market/products`, {
            headers: { 'token': token },
            params: {
                idxId: idxId.value,
                page: currentPage.value,
                pageSize: pageSize
            }
        });
        if (response.data.code === 200) {
            marketData.value = response.data.data.list;
            // totalPages.value = Math.ceil(response.data.data.total / pageSize);
        }
    } catch (error) {
        console.error('获取数据失败:', error);
    }
};
const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage.value > 1) {
        currentPage.value--;
        fetchMarketData();
    } else if (direction === 'next') {
        currentPage.value++;
        fetchMarketData();
    }
};
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};
const handleFilter = () => {
    currentPage.value = 1;
    fetchMarketData();
};
watch(idxId, (newVal) => {
    currentPage.value = 1;
    fetchMarketData();
});
function handleClick(direction) {
  const paginationWrapper = document.querySelector('.pagination-wrapper');
  if (direction === 'prev') {
    paginationWrapper.classList.add('transition-prev');

  } else if (direction === 'next') {
    paginationWrapper.classList.add('transition-next');
  }


  setTimeout(() => {
    if (paginationWrapper.classList.contains('transition-next')) {
      paginationWrapper.classList.remove('transition-next');
    } else if (paginationWrapper.classList.contains('transition-prev')) {
      paginationWrapper.classList.remove('transition-prev');
    }
  }, 500);
}

onMounted(() => {
  const btns = document.querySelectorAll('.btns');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('btn--prev')) {
        handleClick('prev');
      } else if (btn.classList.contains('btn--next')) {
        handleClick('next');
      }
    });
  });
  fetchMarketData();
});
</script>
<style scoped>
@import url('../assets/css/choices.min.css');
@import url('../assets/css/style.css');
@import '../assets/css/libs.min.css';
@import '../assets/css/remain.css';
@import '../assets/css/all.min.css';
@import '../assets/css/flatpickr.css';
@import url('/node_modules/bootstrap-icons/font/bootstrap-icons.css');
@import '../assets/css/market.css';
@media (min-width: 992px) {
    .col-lg-3[data-v-5656c4e6] {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
        width: 25% !important;
    }
}

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

</style>