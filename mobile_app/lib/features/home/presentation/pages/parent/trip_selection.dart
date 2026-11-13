import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Chuyến đang được chọn để xem, dùng CHUNG giữa tab Trang chủ và tab Theo dõi.
/// null = tự chọn chuyến phù hợp nhất (đang chạy, rồi sắp chạy, rồi chuyến cuối trong ngày).
class SelectedTripId extends Notifier<String?> {
  @override
  String? build() => null;

  void select(String id) => state = id;
  void clear() => state = null;
}

final selectedTripIdProvider =
    NotifierProvider<SelectedTripId, String?>(SelectedTripId.new);