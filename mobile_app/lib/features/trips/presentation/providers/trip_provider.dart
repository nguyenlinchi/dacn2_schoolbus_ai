import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:mobile_app/features/trips/data/datasources/trip_remote_datasource.dart';
import 'package:mobile_app/features/trips/data/repositories/trip_repository_impl.dart';
import 'package:mobile_app/features/trips/domain/entities/teacher_trip.dart';
import 'package:mobile_app/features/trips/domain/entities/trip_route_detail.dart';
import 'package:mobile_app/features/trips/domain/repositories/trip_repository.dart';
import 'package:mobile_app/features/trips/domain/usecases/get_teacher_current_trip_route.dart';
import 'package:mobile_app/features/trips/domain/usecases/get_teacher_today_trips.dart';

final supabaseClientProvider = Provider<SupabaseClient>(
  (ref) => Supabase.instance.client,
);

final tripRemoteDataSourceProvider = Provider<TripRemoteDataSource>(
  (ref) => TripRemoteDataSource(ref.watch(supabaseClientProvider)),
);

final tripRepositoryProvider = Provider<TripRepository>(
  (ref) => TripRepositoryImpl(ref.watch(tripRemoteDataSourceProvider)),
);

final getTeacherTodayTripsProvider = Provider<GetTeacherTodayTrips>(
  (ref) => GetTeacherTodayTrips(ref.watch(tripRepositoryProvider)),
);

/// Danh sách chuyến xe hôm nay của giáo viên đang đăng nhập.
final teacherTodayTripsProvider =
    FutureProvider.autoDispose<List<TeacherTrip>>((ref) async {
  final client = ref.watch(supabaseClientProvider);
  final authUser = client.auth.currentUser;

  if (authUser == null) {
    throw Exception('Chưa đăng nhập');
  }

  return ref.watch(getTeacherTodayTripsProvider).call(authUser.id);
});

final getTeacherCurrentTripRouteProvider =
    Provider<GetTeacherCurrentTripRoute>(
  (ref) => GetTeacherCurrentTripRoute(ref.watch(tripRepositoryProvider)),
);

/// Lộ trình (điểm dừng) của chuyến hiện tại của giáo viên đang đăng nhập.
final teacherRouteDetailProvider =
    FutureProvider.autoDispose<TripRouteDetail?>((ref) async {
  final client = ref.watch(supabaseClientProvider);
  final authUser = client.auth.currentUser;

  if (authUser == null) {
    throw Exception('Chưa đăng nhập');
  }

  return ref.watch(getTeacherCurrentTripRouteProvider).call(authUser.id);
});