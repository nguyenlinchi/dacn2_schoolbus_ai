import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mobile_app/features/profile/domain/profile_exception.dart';
import 'package:mobile_app/features/profile/presentation/providers/profile_provider.dart';

/// Bảng chỉnh sửa tên và email. Đóng lại với một câu thông báo khi lưu thành công.
class EditProfileSheet extends ConsumerStatefulWidget {
  final String initialName;
  final String initialEmail;

  const EditProfileSheet({
    super.key,
    required this.initialName,
    required this.initialEmail,
  });

  @override
  ConsumerState<EditProfileSheet> createState() => _EditProfileSheetState();
}

class _EditProfileSheetState extends ConsumerState<EditProfileSheet> {
  static const Color primaryColor = Color(0xFF2563EB);

  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;

  bool _saving = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.initialName);
    _emailController = TextEditingController(text: widget.initialEmail);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  String? _validateName(String? value) {
    final text = value?.trim() ?? '';
    if (text.length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
    if (text.length > 150) return 'Họ và tên quá dài';
    return null;
  }

  String? _validateEmail(String? value) {
    final text = value?.trim() ?? '';
    if (text.isEmpty) return 'Vui lòng nhập email';
    if (text.length > 255) return 'Email quá dài';
    if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(text)) {
      return 'Email không hợp lệ';
    }
    return null;
  }

  Future<void> _save() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    final name = _nameController.text.trim();
    final email = _emailController.text.trim();

    final nameChanged = name != widget.initialName;
    final emailChanged =
        email.toLowerCase() != widget.initialEmail.toLowerCase();

    if (!nameChanged && !emailChanged) {
      Navigator.pop(context);
      return;
    }

    setState(() {
      _saving = true;
      _error = null;
    });

    final repository = ref.read(profileRepositoryProvider);

    try {
      if (nameChanged) {
        await repository.updateFullName(name);
        ref.invalidate(userProfileProvider);
      }

      if (emailChanged) {
        await repository.requestEmailChange(email);
      }

      if (!mounted) return;

      Navigator.pop(
        context,
        emailChanged
            ? 'Đã lưu. Hãy kiểm tra hộp thư của email mới để xác nhận việc đổi email.'
            : 'Đã cập nhật thông tin cá nhân.',
      );
    } on ProfileException catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.message;
        _saving = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Có lỗi xảy ra, vui lòng thử lại.';
        _saving = false;
      });
    }
  }

  InputDecoration _decoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, color: primaryColor),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Chỉnh sửa thông tin',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 18),
              TextFormField(
                controller: _nameController,
                enabled: !_saving,
                textCapitalization: TextCapitalization.words,
                textInputAction: TextInputAction.next,
                validator: _validateName,
                decoration: _decoration('Họ và tên', Icons.person_outline),
              ),
              const SizedBox(height: 14),
              TextFormField(
                controller: _emailController,
                enabled: !_saving,
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.done,
                validator: _validateEmail,
                onFieldSubmitted: (_) => _save(),
                decoration: _decoration('Email', Icons.email_outlined),
              ),
              const SizedBox(height: 6),
              Text(
                'Khi đổi email, hệ thống sẽ gửi thư xác nhận tới email mới. '
                'Email chỉ thay đổi sau khi bạn xác nhận.',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Text(_error!, style: const TextStyle(color: Colors.red)),
              ],
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _saving ? null : () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size.fromHeight(48),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Hủy'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _saving ? null : _save,
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(48),
                        backgroundColor: primaryColor,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: _saving
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text('Lưu thay đổi'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}