import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { InputData, InputDataService } from '../services/inputData';
import { setEnable } from '../utils/setEnable';
import '../styles/input-page.css';

export default function InputPage() {
  const router = useRouter();
  const inputService = new InputDataService();
  const [data, setData] = useState<InputData>(inputService.Data);

  const tunnelKeizyoList = [
    { id: 1, title: '単線' },
    { id: 2, title: '複線' },
    { id: 3, title: '新幹線（在来工法）' },
  ];

  const invertList = [
    { id: 0, title: 'なし' },
    { id: 1, title: 'あり' },
  ];

  const haimenKudoList = [
    { id: 0, title: 'なし' },
    { id: 1, title: 'あり' },
  ];

  const henkeiModeList = [
    { id: 1, title: '側壁全体押出し' },
    { id: 2, title: '側壁上部前傾' },
    { id: 3, title: '脚部押出し' },
    { id: 4, title: '盤ぶくれ' },
  ];

  const uragomeChunyukoList = [
    { id: 0, title: 'なし' },
    { id: 1, title: 'あり' },
  ];

  const lockBoltKouList = [
    { id: 0, title: 'なし' },
    { id: 4, title: '4本' },
    { id: 8, title: '8本' },
    { id: 12, title: '12本' },
  ];

  const downwardLockBoltKouList = [
    { id: 0, title: 'なし' },
    { id: 4, title: '4本' },
    { id: 6, title: '6本' },
  ];

  const uchimakiHokyoList = [
    { id: 0, title: 'なし' },
    { id: 1, title: 'あり' },
  ];

  const lockBoltLengthList = [
    { id: 3, title: '3m' },
    { id: 6, title: '6m' },
    { id: 4, title: '4m' },
    { id: 8, title: '8m' },
  ];

  const downwardLockBoltLengthList = [
    { id: 3, title: '3m' },
    { id: 6, title: '6m' },
    { id: 4, title: '4m' },
    { id: 8, title: '8m' },
  ];

  const handleChange = (field: keyof InputData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Initialize enable state on first render
  const enableState = setEnable(data);
  const [enableData, setEnableData] = useState(enableState);

  useEffect(() => {
    const newEnableState = setEnable(data);
    setEnableData(newEnableState);
  }, [data.tunnelKeizyo, data.henkeiMode, data.lockBoltKou, data.downwardLockBoltKou]);

  return (
    <div>
      <form className="page-container" onSubmit={async (e) => {
        e.preventDefault();
        inputService.Data = data;
        localStorage.setItem('inputData', JSON.stringify(data));
        await router.push('/output-page');
      }}>
        {/* 構造条件 */}
        <div className="container">
          <div className="section-title">
            <h2 className="section-title">構造条件</h2>
            <div className="divider"></div>
          </div>
        </div>

        <div className="container conditions">
          <div className="liner">
            <fieldset>
              <legend>トンネル形状</legend>
              {tunnelKeizyoList.map((x) => (
                <div key={x.id}>
                  <label>
                    <input
                      type="radio"
                      name="tunnelKeizyo"
                      checked={data.tunnelKeizyo === x.id}
                      onChange={() => handleChange('tunnelKeizyo', x.id)}
                    />
                    {x.title}
                  </label>
                </div>
              ))}
            </fieldset>

            <fieldset>
              <legend>覆工巻厚</legend>
              <div id="textbox">
                <input
                  type="number"
                  name="fukukouMakiatsu"
                  value={data.fukukouMakiatsu}
                  onChange={(e) => handleChange('fukukouMakiatsu', Number(e.target.value))}
                  style={{ width: '65px', textAlign: 'center' }}
                  min="30"
                  max="70"
                />
                cm
              </div>
            </fieldset>

            <fieldset>
              <legend>インバートの有無</legend>
              {invertList.map((x) => (
                <div key={x.id}>
                  <label>
                    <input
                      type="radio"
                      name="invert"
                      checked={data.invert === x.id}
                      onChange={() => handleChange('invert', x.id)}
                    />
                    {x.title}
                  </label>
                </div>
              ))}
            </fieldset>
          </div>
        </div>

        {/* 調査・計測結果の条件 */}
        <div className="container">
          <div className="section-title">
            <h2 className="section-title">調査・計測結果の条件</h2>
            <div className="divider"></div>
          </div>
        </div>

        <div className="container conditions">
          <div className="liner">
            <fieldset>
              <legend>背面空洞の有無</legend>
              {haimenKudoList.map((x) => {
                const isDisabled = enableData.uragomeChunyukoStyle?.[x.id] !== 'Enable';
                return (
                  <div key={x.id} className={isDisabled ? 'Disable' : ''}>
                    <label>
                      <input
                        type="radio"
                        name="haimenKudo"
                        checked={data.haimenKudo === x.id}
                        onChange={() => handleChange('haimenKudo', x.id)}
                        disabled={isDisabled}
                      />
                      {x.title}
                    </label>
                  </div>
                );
              })}
            </fieldset>

            <fieldset>
              <legend>変形モード</legend>
              {henkeiModeList.map((x) => (
                <div key={x.id} className={data.henkeiModeStyle?.[x.id] !== 'Enable' ? 'Disable' : ''}>
                  <label>
                    <input
                      type="radio"
                      name="henkeiMode"
                      checked={data.henkeiMode === x.id}
                      onChange={() => handleChange('henkeiMode', x.id)}
                      disabled={data.henkeiModeStyle?.[x.id] !== 'Enable'}
                    />
                    {x.title}
                  </label>
                </div>
              ))}
            </fieldset>

            <fieldset>
              <legend>地山強度</legend>
              <input
                type="number"
                name="jiyamaKyodo"
                value={data.jiyamaKyodo}
                onChange={(e) => handleChange('jiyamaKyodo', Number(e.target.value))}
                style={{ width: '65px', textAlign: 'center' }}
                min="2"
                max="8"
              />
              MPa
            </fieldset>

            <fieldset>
              <legend>内空変位速度, 盤ぶくれ速度</legend>
              <input
                type="number"
                name="naikuHeniSokudo"
                value={data.naikuHeniSokudo}
                onChange={(e) => handleChange('naikuHeniSokudo', Number(e.target.value))}
                style={{ width: '65px', textAlign: 'center' }}
              />
              mm/年
              <button onClick={() => {}}>モニタリングデータ取得</button>
              <div>
                <pre>{/* tempMonitoringData */}</pre>
              </div>
            </fieldset>
          </div>
        </div>

        {/* 対策工の条件 */}
        <div className="container">
          <div className="section-title">
            <h2 className="section-title">対策工の条件</h2>
            <div className="divider"></div>
          </div>
        </div>

        <div className="container conditions">
          <div className="liner">
            <fieldset>
              <legend>裏込注入工</legend>
              {uragomeChunyukoList.map((x) => {
                const isDisabled = enableData.uragomeChunyukoStyle?.[x.id] !== 'Enable';
                return (
                  <div key={x.id} className={isDisabled ? 'Disable' : ''}>
                    <label>
                      <input
                        type="radio"
                        name="uragomeChunyuko"
                        checked={data.uragomeChunyuko === x.id}
                        onChange={() => handleChange('uragomeChunyuko', x.id)}
                        disabled={isDisabled}
                      />
                      {x.title}
                    </label>
                  </div>
                );
              })}
            </fieldset>

            <fieldset>
              <legend>ロックボルト工</legend>
              {!enableData.henkeiMode4Flag ? (
                <div className="liner lockbolt">
                  <div>
                    {lockBoltKouList.map((x) => (
                      <div key={x.id}>
                        <label>
                          <input
                            type="radio"
                            name="lockBoltKou"
                            checked={data.lockBoltKou === x.id}
                            onChange={() => handleChange('lockBoltKou', x.id)}
                          />
                          {x.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="margin-left">
                    {lockBoltLengthList.map((x) => (
                      <div key={x.id} className={enableData.lockBoltLengthStyle?.[x.id] !== 'Enable' ? 'Disable' : ''}>
                        <label>
                          <input
                            type="radio"
                            name="lockBoltLength"
                            checked={data.lockBoltLength === x.id}
                            onChange={() => handleChange('lockBoltLength', x.id)}
                            disabled={enableData.lockBoltLengthStyle?.[x.id] !== 'Enable'}
                          />
                          {x.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>選択できません</p>
              )}
            </fieldset>

            <fieldset>
              <legend>ロックボルト工（下向き）</legend>
              {enableData.downwardLockBoltLengthStyle === 'Enable' ? (
                <div className="liner lockbolt">
                  <div>
                    {downwardLockBoltKouList.map((x) => (
                      <div key={x.id}>
                        <label>
                          <input
                            type="radio"
                            name="downwardLockBoltKou"
                            checked={data.downwardLockBoltKou === x.id}
                            onChange={() => handleChange('downwardLockBoltKou', x.id)}
                          />
                          {x.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="margin-left">
                    {downwardLockBoltLengthList.map((x) => (
                      <div key={x.id} className={enableData.downwardLockBoltLengthStyle !== 'Enable' ? 'Disable' : ''}>
                        <label>
                          <input
                            type="radio"
                            name="downwardLockBoltLength"
                            checked={data.downwardLockBoltLength === x.id}
                            onChange={() => handleChange('downwardLockBoltLength', x.id)}
                            disabled={enableData.downwardLockBoltLengthStyle !== 'Enable'}
                          />
                          {x.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>選択できません</p>
              )}
            </fieldset>

            <fieldset>
              <legend>内巻補強</legend>
              {!enableData.henkeiMode4Flag ? (
                uchimakiHokyoList.map((x) => {
                  const isDisabled = enableData.uchimakiHokyoStyle?.[x.id] !== 'Enable';
                  return (
                    <div key={x.id} className={isDisabled ? 'Disable' : ''}>
                      <label>
                        <input
                          type="radio"
                          name="uchimakiHokyo"
                          checked={data.uchimakiHokyo === x.id}
                          onChange={() => handleChange('uchimakiHokyo', x.id)}
                          disabled={isDisabled}
                        />
                        {x.title}
                      </label>
                    </div>
                  );
                })
              ) : (
                <p>選択できません</p>
              )}
            </fieldset>
          </div>
        </div>

        <div className="submit-container">
          <button type="submit" className="submit-button">計算する</button>
        </div>
      </form>
    </div>
  );
}
