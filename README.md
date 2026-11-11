# Learning

数学・アルゴリズム・機械学習・ソフトウェア開発の学習記録です。
各テーマについて、学んだ理論、実装や演習、検証結果、残っている課題をまとめていきます。

## まず見てほしい記録

| テーマ | 取り組んだこと | 記録 |
| --- | --- | --- |
| パーセプトロンの幾何・更新則・収束 | 決定境界までの距離と勾配を検算。更新ごとの境界を描き、主形式と双対形式の一致を確認。 | [概要・実験結果](machine-learning/perceptron/README.md) / [Notebook](machine-learning/perceptron/notebooks/perceptron_geometry_convergence_gradient_lab.ipynb) |
| 世界モデル2025：物体中心表現と意味・位置分離 | Slot Attention・SAVi型モデル・意味と位置を分けたモデルをPyTorchで実装。MOVi-Aで再構成と追跡を評価し、指標の定義と検証範囲を整理。 | [概要・実験結果](projects/world-model-2025/README.md) / [Notebook一覧](projects/world-model-2025/notebooks/) |
| ポテンシャル関数法 | ガウス型ポテンシャル関数を用いた双対パーセプトロンをNumPyで実装。人工データで学習過程・決定境界・カーネル幅による挙動の違いを検証。 | [概要・実験結果](machine-learning/potential-function-dual-perceptron/README.md) / [Notebook](machine-learning/potential-function-dual-perceptron/notebooks/potential_function_dual_perceptron.ipynb) |
| 機械学習のための線形代数 | 掃き出し法・Gram–Schmidt法を実装。固有値・SVD・擬似逆を検算し、回帰・正則化につながる性質を可視化。 | [概要・検証結果](mathematics/linear-algebra/README.md) / [Notebook](mathematics/linear-algebra/notebooks/linear_algebra_for_machine_learning.ipynb) |
| Ridge・Lassoの正則化 | Ridgeと座標降下法によるLassoを実装。係数パス・劣微分を可視化し、fold内標準化によるCVと人工データのテスト評価を実施。 | [概要・実験結果](machine-learning/regularization/README.md) / [Notebook](machine-learning/regularization/notebooks/ridge_lasso_regularization.ipynb) |

## 分野別の記録

- [数学](mathematics/README.md)：機械学習に必要な線形代数の実装と検算
- [機械学習](machine-learning/README.md)：パーセプトロン、ポテンシャル関数法、Ridge・Lasso、物体中心表現と動画モデル
- [プロジェクト](projects/README.md)：学習内容を組み合わせた実装・実験・評価
- アルゴリズム・ソフトウェア開発：過去の学習内容を順次整理して追加予定

## 記録の読み方

各テーマのREADMEに目的・結果・考察をまとめ、Notebookに数式・実装・実験の詳細を載せています。
実行環境と再現手順、参考資料も各テーマに記載します。
