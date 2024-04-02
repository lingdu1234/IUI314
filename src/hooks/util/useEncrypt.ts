import { JSEncrypt } from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDjn10gpBJ5Gi1sgtrCK1O3Prqi
8xK5vVCC9wevwyZMaJ+6nbmWKuLw3U+L1GErbjAnU7O9GVIYtA/KprS0gK4DKqhP
TaSa0m1bXR7d15paslQXWw8Mfo/bGaDvkpf2f57B3moErPH0WLkHW/ZdRlXXHEdN
kOWPmYSKKUp+hY+YlwIDAQAB`

const privateKey = `MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAOOfXSCkEnkaLWyC
2sIrU7c+uqLzErm9UIL3B6/DJkxon7qduZYq4vDdT4vUYStuMCdTs70ZUhi0D8qm
tLSArgMqqE9NpJrSbVtdHt3XmlqyVBdbDwx+j9sZoO+Sl/Z/nsHeagSs8fRYuQdb
9l1GVdccR02Q5Y+ZhIopSn6Fj5iXAgMBAAECgYEA3F0RVKNi+vj71tyMGoTFpFbH
ay/2Bfmgs1miiGdecYSsdodx/05/rH4lH5M5i0k+tyQSk1SrJR1VWHSx5znYu4aQ
Use6BOeFHAlh2YVSe6I7frS3REnXzAAYAM9V7Ln4XTTeYtgttl2VYhLoPCm3ZwTG
nAPtiyiMyKkqLDhjj5ECQQD28tibAhkVJt0WAfo6eRzbaT57Yqa8gB5ohCg6yE6k
Z6/ktWeb2uxxrnXhelktLk6IqhRiem0qvmPs/ej+p4ifAkEA6/ctmAu8zr4DAr4X
I2fz5dNfYQwjADO6i7WPJvIsd3DN6x36Iv2LYqqe3376MV+ZWERP2++AfCl0XvJ7
6VFVCQJANC01VPMJh62Rcu/yBd7HGRjQidNbNWLAiga6VUkzTItX37Pwcz67TH23
DHAEXYZ2M2v0KKaDYE+f31f6nauaMwJBALjttRvuRwC4Rd/GXpfvBmTeLWf/fQbR
g6eumQxqy5KoI5namokFsFGZan26JBbB14onr3as00N7saof3CDVDxECQQDnzstT
/MGtDhLbbcWxyS8QOItjPJHf4YR0zx4ulVPgKEhwzKmrfmaYCGN1gDlID7Og2vtl
7fqo6XY/kf4ZIdiQ`

export function useEncrypt() {
  /**
   *  加密
   * @param {string} txt
   * @return {string} txt
   */
  function encrypt(txt: string): string | boolean {
    const encrypts = new JSEncrypt()
    encrypts.setPublicKey(publicKey) // 设置公钥
    return encrypts.encrypt(txt) // 对数据进行加密
  }

  /**
   *  解密
   * @param {string} txt
   * @return {string} txt
   */
  function decrypt(txt: string): string | boolean {
    const encrypts = new JSEncrypt()
    encrypts.setPrivateKey(privateKey) // 设置私钥
    return encrypts.decrypt(txt) // 对数据进行解密
  }

  return {
    encrypt,
    decrypt,
  }
}
