interface Paging {
  // 指定条件の全件数
  totalCount: number
  // 1ページあたりの件数
  limit: number
  // 取得開始位置
  offset: number
}

interface Page<T> {
  items: T[]
  paging: Paging
}