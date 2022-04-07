<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><span>CPU</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">属性</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">系统</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">核心数</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.cores }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">线程</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.processors }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">cpu使用率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.process">
                      {{ server.cpu_load.one.toFixed(4) }}%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">Load Avg 5</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu_load">
                      {{ server.cpu_load.five.toFixed(4) }}%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">Load Avg 15</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu_load">
                      {{ server.cpu_load.fifteen.toFixed(4) }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><span>内存</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">属性</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">内存</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">本系统</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">总共内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ memorySizeFormat(server.memory.totol_memory) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">已用内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ memorySizeFormat(server.memory.used_memory) }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.process">
                      {{ memorySizeFormat(server.process.used_memory) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">总共虚拟</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ memorySizeFormat(server.memory.totol_swap) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">已用虚拟</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ memorySizeFormat(server.memory.used_swap) }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.process">
                      {{ memorySizeFormat(server.process.used_virtual_memory) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">使用率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.memory">
                      {{ mem_usage }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><span>服务器信息</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">服务器名</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.server">
                      {{ server.server.host_name }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">CPU</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.name }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">架构</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.arch }}
                    </div>
                  </td>
                </tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">操作系统</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="server.server">
                    {{ server.server.oper_sys_name }}
                  </div>
                </td>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">系统版本</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.server">
                      {{ server.server.system_version }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">系统内核</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.server">
                      {{ server.server.system_kerne }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><span>程序信息</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">程序名称</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.process">
                      {{ server.process.name }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">启动时间</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.process">
                      {{
                        new Date(
                          server.process.start_time * 1000
                        ).toLocaleString()
                      }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">运行时间</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.process">
                      {{ timeFormat2DHMS(server.process.run_time) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">CPU使用</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.process">
                      {{ server.process.cup_usage.toFixed(4) }}%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">硬盘读</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.process">
                      {{
                        memorySizeFormat(server.process.disk_usage.read_bytes)
                      }}
                      ----
                      {{
                        memorySizeFormat(
                          server.process.disk_usage.total_read_bytes
                        )
                      }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">硬盘写</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.process">
                      {{
                        memorySizeFormat(
                          server.process.disk_usage.written_bytes
                        )
                      }}
                      ----{{
                        memorySizeFormat(
                          server.process.disk_usage.total_written_bytes
                        )
                      }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header><span>网络状态</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell el-table__cell is-leaf">
                    <div class="cell">网络名称</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">接收</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">总接收</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">传输</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">总传输</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="server.network">
                <tr v-for="(v, _) in server.network" :key="v.name">
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ v.name }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ memorySizeFormat(v.received) }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ memorySizeFormat(v.total_received) }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                     <div class="cell">{{ memorySizeFormat(v.transmitted) }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                     <div class="cell">{{ memorySizeFormat(v.total_transmitted) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="serverMonitor">
import { getCurrentInstance,ref } from "vue";

import { getServer } from '@/api/monitor/server';
const { proxy } = getCurrentInstance();

const server = ref([]);
const mem_usage = ref('');


function getList() {
  proxy.$modal.loading('正在加载服务监控数据，请稍候！');
  getServer().then((response) => {
    server.value = response;
    const mem_usage_v =
      (100 * server.value.memory.used_memory) /
      server.value.memory.totol_memory;
    mem_usage.value = mem_usage_v.toFixed(2);
    proxy.$modal.closeLoading();
  });
}
const memorySizeFormat = (size) => {
  size = parseFloat(size);
  let rank = 0;
  let rankchar = 'Bytes';
  while (size > 1024 && rankchar != 'GB') {
    size = size / 1024;
    rank++;
    if (rank == 1) {
      rankchar = 'KB';
    } else if (rank == 2) {
      rankchar = 'MB';
    } else if (rank == 3) {
      rankchar = 'GB';
    }
  }
  return size.toFixed(2) + ' ' + rankchar;
};

// 秒转行为日时分秒
const timeFormat2DHMS = (sec) => {
  sec = parseInt(sec);
  let day = parseInt(sec / (24 * 3600));
  let hour = parseInt((sec % (24 * 3600)) / 3600);
  let min = parseInt((sec % 3600) / 60);
  let second = parseInt(sec % 60);
  let res = '';

  if (day > 0) {
    res += day + '天';
  }
  if (hour > 0) {
    res += hour + '小时';
  }
  if (min > 0) {
    res += min + '分';
  }
  if (second > 0) {
    res += second + '秒';
  }
  return res;
};

getList();
</script>
