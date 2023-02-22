<template>
  <div class="sm:px-6 p-4">
    <h3
      class="text-3xl font-medium text-gray-800 dark:text-gray-200"
      @click="show = true"
    >
      Dashboard
    </h3>

    <div class="mt-4 mb-10">
      <div class="flex flex-wrap -mx-6">
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <div
            class="flex items-center px-5 py-6 bg-zinc-200 dark:bg-zinc-800 rounded-md shadow-sm"
          >
            <icon-lucide-user-cog class="text-2xl text-emerald-500" />

            <div class="mx-5">
              <h4
                class="text-2xl font-semibold text-gray-700 dark:text-gray-200"
              >
                1000
              </h4>
              <div class="text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
          </div>
        </div>

        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
          <div
            class="flex items-center px-5 py-6 bg-zinc-200 dark:bg-zinc-800 rounded-md shadow-sm"
          >
            <icon-lucide-users class="text-2xl text-pink-400" />

            <div class="mx-5">
              <h4
                class="text-2xl font-semibold text-gray-700 dark:text-gray-200"
              >
                200
              </h4>
              <div class="text-gray-600 dark:text-gray-400">Total Teams</div>
            </div>
          </div>
        </div>

        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
          <div
            class="flex items-center px-5 py-6 bg-zinc-200 dark:bg-zinc-800 rounded-md shadow-sm"
          >
            <icon-lucide-lock class="text-2xl text-cyan-400" />

            <div class="mx-5">
              <h4
                class="text-2xl font-semibold text-gray-700 dark:text-gray-200"
              >
                20
              </h4>
              <div class="text-gray-600 dark:text-gray-400">Total Roles</div>
            </div>
          </div>
        </div>

        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 xl:mt-10">
          <div
            class="flex items-center px-5 py-6 bg-zinc-200 dark:bg-zinc-800 rounded-md shadow-sm"
          >
            <icon-lucide-line-chart class="text-2xl text-orange-400" />

            <div class="mx-5">
              <h4
                class="text-2xl font-semibold text-gray-700 dark:text-gray-200"
              >
                215
              </h4>
              <div class="text-gray-600 dark:text-gray-400">
                Total Collections
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <HoppSmartExpand>
        <template #body>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut sunt
            quibusdam dolores, a facilis perspiciatis nulla sit ad praesentium!
            Commodi, error. Pariatur porro ipsa exercitationem maiores earum
            voluptatibus! Rem, quos. Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Voluptates tenetur, cupiditate tempora earum
            quisquam, veniam reprehenderit non qui necessitatibus neque
          </p>
          <p>
            consectetur esse repellat minima quam cumque ratione. Consectetur,
            facilis et. Lorem ipsum dolor sit, amet consectetur adipisicing
            elit. Aliquid praesentium tempore doloremque odit nisi, distinctio
            pariatur, consequatur ipsam ducimus nam aliquam ad voluptas mollitia
            provident dolorem aperiam autem dolore enim! Lorem, ipsum dolor sit
            amet
          </p>
          <p>
            consectetur adipisicing elit. Velit, ipsum libero asperiores sint
            quae accusamus minima, magni beatae, ullam quia provident dolores
            inventore voluptatum. Commodi amet hic rem quae ex. Lorem ipsum
            dolor, sit amet consectetur adipisicing elit. Tempore ullam maxime
            ut pariatur soluta similique illo enim, exercitationem fuga omnis
            dolore debitis
          </p>
          <p>
            dignissimos quia non culpa dolor placeat facere voluptate. Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Tenetur sint
            recusandae, id atque quam commodi ipsum libero quasi ullam quidem
            unde blanditiis harum dignissimos possimus optio consequatur vero
            nisi quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reiciendis hic unde quia nostrum facilis asperiores eligendi
            impedit, beatae repellendus cupiditate quasi, cum saepe dolor
            voluptas fugit recusandae quo, expedita cumque?
          </p>
        </template>
      </HoppSmartExpand>
    </div>

    <HoppSmartModal v-if="show" title="New Modal" @close="show = false">
      <template #body>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam
          sapiente corporis hic, iste eveniet officia sequi libero consequatur
          porro odit provident asperiores quod deserunt. Rerum dolorum qui quod
          ullam veritatis?
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum
          totam sapiente dolore, suscipit neque odio, omnis aliquid quas eveniet
          iste ex veniam voluptatum quasi ducimus, deleniti nisi quos! Sequi,
          rerum!
        </p>
      </template>
    </HoppSmartModal>

    <div class="mt-8"></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const show = ref(false);
</script>
