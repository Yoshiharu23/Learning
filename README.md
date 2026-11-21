# Learning

数学・機械学習・ソフトウェア開発の学習記録です。分野ごとにテーマをまとめ、各テーマのREADMEから説明・実装・実験結果をたどれる構成にしています。

## ディレクトリ構成

```text
Learning/
├── README.md
├── mathematics/                            # 数学の理論と数値計算
│   ├── README.md
│   ├── linear-algebra/                      # 線形代数
│   └── convex-quadratic-programming/        # 凸二次計画・KKT条件・双対性
├── machine-learning/                       # 機械学習の理論・実装・開発
│   ├── README.md
│   ├── perceptron/                         # パーセプトロン・収束定理
│   ├── potential-function-dual-perceptron/  # ポテンシャル関数法
│   ├── linear-hard-margin-svm/             # ハードマージンSVM
│   ├── soft-margin-svm/                    # ソフトマージンSVM
│   ├── regularization/                     # Ridge・Lasso
│   └── ml-project-structure/               # MLプロジェクトの構成と開発の流れ
├── software-development/                  # ソフトウェアの設計・実装・検証
│   ├── README.md
│   └── web-development/                   # Web開発の学習記録と公開用の小さなアプリ
└── projects/                               # 学習内容を組み合わせたプロジェクト
    ├── README.md
    └── world-model-2025/                   # 物体中心表現・動画モデル
```

## 分野ごとの入口

| ディレクトリ | 内容 |
| --- | --- |
| [mathematics/](mathematics/README.md) | 線形代数、凸二次計画など、機械学習を支える数学の実装と検算 |
| [machine-learning/](machine-learning/README.md) | 学習アルゴリズムの導出・実装・実験と、MLプロジェクトの開発方法 |
| [software-development/](software-development/README.md) | Webアプリケーションの設計・実装・テストと、動作を試せるサンプル |
| [projects/](projects/README.md) | 複数の知識を組み合わせたモデルの実装・実験・評価 |

## テーマ内のファイル

各テーマでは、学習内容に応じて次のファイル・ディレクトリを置いています。

| ファイル・ディレクトリ | 役割 |
| --- | --- |
| `README.md` | テーマの概要、学習内容、主な結果、実行方法、参考資料 |
| `notebooks/` | 数式・コード・実験を順に確認できるJupyter Notebook |
| `figures/` | 決定境界、学習履歴などの図や可視化 |
| `requirements.txt` | 実行に必要なPythonライブラリ |
| `results/` | 実験設定、評価値、集計結果 |
| `scripts/` | 結果の集計などを行うスクリプト |
| `demo/` | 学習した技術を小さな構成で試せるアプリケーション |
| `docs/` | 設計の考え方や実装範囲の説明 |
| その他のMarkdown | 定理の証明、再現手順、出典などの補足説明 |

分野のREADMEから関心のあるテーマへ進み、テーマのREADMEで概要と結果を確認してからNotebookや補足資料を読む流れを想定しています。
