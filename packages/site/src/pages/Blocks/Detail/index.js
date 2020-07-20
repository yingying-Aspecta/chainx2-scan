import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import Breadcrumb from '../../../components/Breadcrumb'
import $t from '../../../locale'
import { NavLink, useParams } from 'react-router-dom'
import api from '../../../services/api'
import Spinner from '../../../components/Spinner'
import { useSelector } from 'react-redux'
import { latestHeightSelector } from '../../../store/reducers/latestBlockSlice'
import PanelList from '../../../components/PanelList'
import BlockLink from '../../../components/BlockLink'
import DateShow from '../../../components/DateShow'

export default function() {
  const { heightOrHash } = useParams()
  const [block, setBlock] = useState(null)
  const [loading, setLoading] = useState(false)
  const latestHeight = useSelector(latestHeightSelector)
  const hasNext = block?.header?.number < latestHeight
  const preHeight = block?.header?.number - 1
  console.log(block)

  useEffect(() => {
    setLoading(true)
    const { promise, cancel } = api.fetchBlock(heightOrHash)
    promise
      .then(({ result: data }) => {
        setBlock(data)
      })
      .finally(() => setLoading(false))

    return () => cancel()
  }, [heightOrHash])

  const breadcrumb = (
    <Breadcrumb
      dataSource={[
        { to: '/blocks', label: $t('block_list') },
        { label: $t('block_detail') }
      ]}
    />
  )

  if (loading) {
    return (
      <>
        {breadcrumb}
        <div style={{ padding: '10%' }}>
          <Spinner />
        </div>
      </>
    )
  }

  return (
    <div>
      {breadcrumb}
      <div className="switch-block">
        <NavLink
          to={`/blocks/${preHeight < 0 ? block?.header?.number : preHeight}`}
        >
          <i
            className={classnames(
              { forbidden: preHeight < 0 },
              'iconfont icon-left'
            )}
          />
        </NavLink>
        {$t('block_height')}:{block?.header?.number}
        <NavLink
          to={
            hasNext
              ? `/blocks/${block?.header?.number + 1}`
              : `/blocks/${block?.header?.number}`
          }
        >
          <i
            className={classnames(
              { forbidden: !hasNext },
              'iconfont icon-right'
            )}
          />
        </NavLink>
      </div>
      <PanelList
        dataSource={[
          {
            label: $t('block_height'),
            data: block?.header?.number
          },
          {
            label: $t('block_hash'),
            data: block?.hash
          },
          {
            label: $t('block_parent_hash'),
            data: <BlockLink value={block?.header?.parentHash} />
          },
          {
            label: $t('block_state_root'),
            data: block?.header?.stateRoot
          },
          {
            label: $t('block_extrinsics_root'),
            data: block?.header?.extrinsicsRoot
          },
          {
            label: $t('block_time'),
            data: (
              <DateShow value={block?.blockTime} format="YYYY-MM-DD HH:mm:ss" />
            )
          }
        ]}
      />
    </div>
  )
}