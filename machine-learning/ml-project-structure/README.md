# ML プロジェクトの構成と開発の流れ

観葉植物の水やり判定を題材に、学習・評価・推論に必要なファイルをどう分けるかを整理した。以下のデータ、設定、実験結果はすべて架空の例。

## ディレクトリ構成の例

```text
plant-watering-ml/
├── src/plant_ml/                  # 学習と推論で共有する特徴量変換
├── features/schema.yaml           # 入力項目、型、単位、欠損時の扱い
├── configs/train_v1.yaml          # データ分割、モデル、乱数シード
├── pipeline/
│   ├── prepare_data.py            # データの整形と分割
│   ├── train.py                   # モデルを学習して保存
│   └── evaluate.py                # 基準モデルと評価指標を比較
├── experiments/runs/              # 実行ごとの設定・指標・成果物への参照
├── model_registry/models.yaml     # モデルの版、対応する実験 ID、採用状態
├── serving/                       # 推論の入口
├── contracts/predict.schema.json  # 推論 API の入出力仕様
├── tests/                         # データ分割、特徴量変換、API のテスト
└── docs/decisions/                # 設計判断とその理由
```

特徴量変換を `src/` に置き、学習処理と推論処理の両方から呼ぶ。`features/` には入力項目の定義を置き、`contracts/` には利用側が依存する入出力仕様を置く。実験の記録には成果物への参照を残し、データ本体や学習済みモデルはアクセスを管理できるストレージに置く。

## 開発の流れ

1. **データを準備する。** 判定時点で取得できる土壌水分や気温を特徴量にする。観測日で学習・検証・テストに分割し、学習データから求めた前処理のパラメータを検証・テスト・推論にも使う。
2. **基準を作って学習する。** 土壌水分のしきい値で判定するルールを基準にする。モデルや分割条件を変えたら新しい設定ファイルを作り、過去の実験から同じ設定をたどれるようにする。
3. **同じ条件で評価する。** 検証データで基準ルールとモデルを比較して採用候補を選ぶ。モデル選択後、取り置いたテストデータで最終評価する。
4. **採用モデルを登録する。** モデルの版と実験 ID を台帳に記録する。推論でも同じ特徴量変換を使い、入力の検証と、同じ入力に対する学習・推論の変換結果の一致をテストする。

## ファイルの記入例

`configs/train_v1.yaml`

```yaml
data_version: synthetic-plants-v1
split:
  strategy: chronological
  train_end: '2025-06-30'
  validation_end: '2025-08-31'
  test_end: '2025-10-31'
model: logistic_regression
seed: 42
```

`experiments/runs/example-001.yaml`

```yaml
run_id: example-001
git_commit: '<実行時のコミット SHA>'
data_version: synthetic-plants-v1
config: configs/train_v1.yaml
validation:
  baseline_f1: 0.65
  model_f1: 0.78
artifact: 'artifacts/example-001/model.joblib'
```

実験結果から、当時のコード・データ・設定を一緒に特定できる。モデル台帳に実験 ID をひもづけておくと、推論で使っているモデルの採用根拠もたどれる。

[機械学習の目次へ](../README.md)
