# 実行方法と再現性の記録

## 保存済みの結果を読む・再集計する

READMEと`figures/`は、GPUやデータセットを用意せずに閲覧できます。
CSVの再集計にはPython 3.9以上の標準ライブラリだけを使います。Learningのルートで次を実行してください。

```bash
python3 projects/world-model-2025/scripts/summarize_results.py
```

標準出力に、動画ごとの平均・全遷移に対するswap率・学習ログの最終値・検証lossの有効件数をJSON形式で出力します。
保存済みの集計結果と比較する場合：

```bash
python3 projects/world-model-2025/scripts/summarize_results.py --check
```

## Notebookの読み進め方

1. [SlotAttention_MOVi_A.ipynb](notebooks/SlotAttention_MOVi_A.ipynb)：静止画の再構成、フレームへの適用、GTを使う追跡評価。
2. [SAVi_MOVi_A_baseline.ipynb](notebooks/SAVi_MOVi_A_baseline.ipynb)：スロットを時間方向に引き継ぐPredict→Correctの構造。
3. [SAVi_MOVi_A_disentangled.ipynb](notebooks/SAVi_MOVi_A_disentangled.ipynb)：意味・位置の分岐、分離デコーダ、EMA、追加損失。

## 学習・推論を再実行する場合

元READMEではPython 3.10以上、GPUを使うPyTorch、JupyterまたはGoogle Colabを想定しています。
Notebookは実験時のスナップショットとして取り込み、コードを変更していません。
当時の依存ライブラリのバージョン一式は保存されていないため、固定された動作確認済み環境は提供できていません。

Notebook内の主な依存はPyTorch・torchvision・NumPy・tensorflow-datasets・tensorflow-io-gcs-filesystem・einops・Matplotlib・tqdm・SciPy・pandas・Pillow・imageioです。
TFDSのデータ読み込みに必要なTensorFlowも含め、実行環境に応じて用意してください。
元のインストールセルはCUDA 12.1用のPyTorch配布先を指定しています。GPU環境と合わせて確認する必要があります。

準備と実行時の確認事項：

1. Jupyter/ColabでNotebookを開き、データ取得・モデル定義・学習ループ・評価の各セルを確認する。
2. MOVi-Aを公開GCSのTFDS形式から読み込む設定を確認する。候補バージョンが利用できなければ`download_and_prepare()`へ進む実装になっている。
3. `/content/`を使う保存先・キャッシュ先を、実行環境の書き込み可能なパスに合わせる。
4. まず小さいバッチ・少ないステップでデータのshape、再構成、損失と勾配を確認し、その後に本学習を実行する。
5. モデルと評価コードの組み合わせを固定し、設定・重み・生の評価値・ライブラリのバージョンを保存する。

設定の目安は以下です。保存済み静止画実験の設定と、動画モデルのコード上の設定を区別しています。

| 項目 | 静止画Slot Attentionの保存config | SAVi型Notebookの設定 |
| --- | --- | --- |
| 画像サイズ | 128×128 | 128×128 |
| スロット数・次元 | 7・64 | 7・64 |
| Attention反復 | 3 | 3 |
| バッチサイズ | 32 | 8 |
| 動画の学習・評価フレーム数 | フレーム学習・追跡評価24 | 学習12・評価24 |
| 学習ステップ | 保存ログは50,000まで | 最大80,000 |
| 乱数seed | コード上42 | コード上42 |

### 評価関数の再定義に注意

SAVi型Notebookには`compute_id_swap_stats`など同名関数の再定義があります。
初期の定義は`swap_rate_mean`、後の定義は`id_swap_mean`というキーを返します。
初期の定義を想定する評価セルを後から再実行すると、出力キーが合わなくなります。
比較実験を再実行する際には、関数定義・面積閾値・呼び出す評価セルを揃える必要があります。

意味・位置分離モデルの長期評価では、ラッパーを外して`model.base`を評価するセルがあります。
この出力だけで分離デコーダやEMAの効果を評価したことにはなりません。

## 学習済み重みと完全な実験履歴

元の[resultsディレクトリ](https://github.com/Yoshiharu23/Worldmodel2025_final/tree/77df2fb7595bb1a09101b979f974235766b02b33/results)に、SAVi型ベースラインと分離モデルのチェックポイントがあります。
Learningには主要なNotebookと軽量な結果を保存し、重み・全チェックポイント・途中の再構成図は元リポジトリを参照します。
重みを使う場合は、対応するモデル定義と設定を確認してから、Notebookのロード処理にパスを指定してください。

## 今回確認した範囲

- 元コミットのNotebook・図・CSV・configと、取り込んだファイルのバイト単位の一致。
- 3つのNotebookのJSONと、IPythonの`!pip`行を除いたコードセルのPython構文。
- 保存された64動画のCSVと501行の学習ログの集計。
- README内のローカルリンクと、集計スクリプトの出力・保存JSONの一致。

GPU学習、データセット取得、重みからの再推論、学習環境の構築は今回実施していません。

[プロジェクトの概要へ](README.md)
