import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { InputData, InputDataService } from '../services/inputData';
import { setEnable } from '../utils/setEnable';
import '../styles/input-page.css';

// Add type declarations for event handlers
type FormEvent = React.FormEvent<HTMLFormElement>;
type InputEvent = React.ChangeEvent<HTMLInputElement>;

export default function InputPage() {
  const router = useRouter();
  const inputService = new InputDataService();
  const [data, setData] = useState<InputData>(inputService.Data);
  const [enableState, setEnableState] = useState(setEnable(data));

  useEffect(() => {
    setEnableState(setEnable(data));
  }, [data]);

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

  const handleChange = (field: keyof InputData, value: number): void => {
    setData((prev: InputData) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="page-container" onSubmit={async (e: FormEvent) => {
      e.preventDefault();
      inputService.Data = data;
      localStorage.setItem('inputData', JSON.stringify(data));
      await router.push('/output-page');
    }}>
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
                value={data.fukukouMakiatsu}
                onChange={(e: InputEvent) => handleChange('fukukouMakiatsu', Number(e.target.value))}
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
            {haimenKudoList.map((x) => (
              <div key={x.id}>
                <label>
                  <input
                    type="radio"
                    checked={data.haimenKudo === x.id}
                    onChange={() => handleChange('haimenKudo', x.id)}
                  />
                  {x.title}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>変形モード</legend>
            {henkeiModeList.map((x) => (
              <div key={x.id}>
                <label>
                  <input
                    type="radio"
                    checked={data.henkeiMode === x.id}
                    onChange={() => handleChange('henkeiMode', x.id)}
                    disabled={enableState.henkeiModeStyle[x.id - 1] !== 'Enable'}
                  />
                  {x.title}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>地山強度</legend>
            <div id="textbox">
              <input
                type="number"
                value={data.jiyamaKyodo}
                onChange={(e: InputEvent) => handleChange('jiyamaKyodo', Number(e.target.value))}
                style={{ width: '65px', textAlign: 'center' }}
                min="2"
                max="8"
              />
              MPa
            </div>
          </fieldset>

          <fieldset>
            <legend>内空変位速度</legend>
            <div id="textbox">
              <input
                type="number"
                value={data.naikuHeniSokudo}
                onChange={(e: InputEvent) => handleChange('naikuHeniSokudo', Number(e.target.value))}
                style={{ width: '65px', textAlign: 'center' }}
              />
              mm/年
            </div>
          </fieldset>
        </div>
      </div>

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
            {uragomeChunyukoList.map((x) => (
              <div key={x.id}>
                <label>
                  <input
                    type="radio"
                    checked={data.uragomeChunyuko === x.id}
                    onChange={() => handleChange('uragomeChunyuko', x.id)}
                    disabled={enableState.uragomeChunyukoStyle[x.id] !== 'Enable'}
                  />
                  {x.title}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>ロックボルト工</legend>
            <div className="liner">
              <div>
                {lockBoltKouList.map((x) => (
                  <div key={x.id}>
                    <label>
                      <input
                        type="radio"
                        checked={data.lockBoltKou === x.id}
                        onChange={() => handleChange('lockBoltKou', x.id)}
                        disabled={enableState.henkeiMode4Flag}
                      />
                      {x.title}
                    </label>
                  </div>
                ))}
              </div>
              <div id="textbox" className="margin-left">
                <input
                  type="number"
                  value={data.lockBoltLength}
                  onChange={(e: InputEvent) => handleChange('lockBoltLength', Number(e.target.value))}
                  style={{ width: '65px', textAlign: 'center' }}
                  disabled={data.lockBoltKou === 0}
                />
                m
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>ロックボルト工（下向き）</legend>
            <div className="liner">
              <div>
                {downwardLockBoltKouList.map((x) => (
                  <div key={x.id}>
                    <label>
                      <input
                        type="radio"
                        checked={data.downwardLockBoltKou === x.id}
                        onChange={() => handleChange('downwardLockBoltKou', x.id)}
                        disabled={!enableState.downwardLockBoltEnable}
                      />
                      {x.title}
                    </label>
                  </div>
                ))}
              </div>
              <div id="textbox" className="margin-left">
                <input
                  type="number"
                  value={data.downwardLockBoltLength}
                  onChange={(e: InputEvent) => handleChange('downwardLockBoltLength', Number(e.target.value))}
                  style={{ width: '65px', textAlign: 'center' }}
                  disabled={enableState.downwardLockBoltLengthStyle !== 'Enable'}
                />
                m
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>内巻補強</legend>
            {uchimakiHokyoList.map((x) => (
              <div key={x.id}>
                <label>
                  <input
                    type="radio"
                    checked={data.uchimakiHokyo === x.id}
                    onChange={() => handleChange('uchimakiHokyo', x.id)}
                    disabled={enableState.henkeiMode4Flag}
                  />
                  {x.title}
                </label>
              </div>
            ))}
          </fieldset>
        </div>
      </div>
      <div className="submit-container">
        <button type="submit" className="submit-button">計算する</button>
      </div>
    </form>
  );
}
