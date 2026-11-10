class UserProfile {
  final String userId;
  final String fullName;
  final String email;
  final String? avatarUrl;

  const UserProfile({
    required this.userId,
    required this.fullName,
    required this.email,
    this.avatarUrl,
  });

  bool get hasAvatar => avatarUrl != null && avatarUrl!.isNotEmpty;
}